import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { subDays, parse, differenceInDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { accounts, typeTransactions, transactions, person, users } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "dd-MM-yyyy", new Date())
        : defaultFrom;
      const endDate = to
        ? parse(to, "dd-MM-yyyy", new Date())
        : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(
        userId: string,
        startDate: Date,
        endDate: Date,
      ) {
        return await db
          .select({
            income: sql`SUM(CASE WHEN CAST(${transactions.amount} AS NUMERIC) >= 0 THEN CAST(${transactions.amount} AS NUMERIC) ELSE 0 END)`.mapWith(Number),
            expenses: sql`SUM(CASE WHEN CAST(${transactions.amount} AS NUMERIC) < 0 THEN CAST(${transactions.amount} AS NUMERIC) ELSE 0 END)`.mapWith(Number),
            remaining: sum(sql`CAST(${transactions.amount} AS NUMERIC)`).mapWith(Number),
          })
          .from(transactions)
          .innerJoin(person, eq(person.id, transactions.personId))
          .innerJoin(accounts, eq(accounts.personId, person.id))
          .where(
            and(
              accountId ? eq(accounts.id, accountId) : undefined,
              eq(person.userExternalId, userId),
              gte(transactions.date, startDate),
              lte(transactions.date, endDate),
            )
          );
      };

      const [currentPeriod] = await fetchFinancialData(
        auth.userId,
        startDate,
        endDate,
      );
      const [lastPeriod] = await fetchFinancialData(
        auth.userId,
        lastPeriodStart,
        lastPeriodEnd,
      );

      const incomeChange = calculatePercentageChange(
        currentPeriod.income,
        lastPeriod.income,
      );
      const expensesChange = calculatePercentageChange(
        currentPeriod.expenses,
        lastPeriod.expenses,
      );
      const remainingChange = calculatePercentageChange(
        currentPeriod.remaining,
        lastPeriod.remaining,
      );

      const category = await db
        .select({
          name: typeTransactions.name,
          value: sql`SUM(ABS(CAST(${transactions.amount} AS NUMERIC)))`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(
          typeTransactions,
          eq(
            transactions.typeTransactionId,
            typeTransactions.id,
          )
        ).innerJoin(person, eq(person.id, transactions.personId))
        .innerJoin(accounts, eq(accounts.personId, person.id))
        .where(
          and(
            accountId ? eq(accounts.id, accountId) : undefined,
            eq(person.userExternalId, auth.userId),
            // lt(transactions.amount, 0),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          )
        )
        .groupBy(typeTransactions.name)
        .orderBy(desc(
          sql`SUM(ABS(CAST(${transactions.amount} AS NUMERIC)))`
        ));

      const topCategories = category.slice(0, 3);
      const otherCategories = category.slice(3);
      const otherSum = otherCategories
        .reduce((sum, current) => sum + current.value, 0);

      const finalCategories = topCategories;
      if (otherCategories.length > 0) {
        finalCategories.push({ 
          name: "Other",
          value: otherSum,
        });
      }

      const activeDays = await db
        .select({
          date: transactions.date,
          income: sql`SUM(CASE WHEN CAST(${transactions.amount} AS NUMERIC) >= 0 THEN CAST(${transactions.amount} AS NUMERIC) ELSE 0 END)`.mapWith(Number),
          expenses: sql`SUM(CASE WHEN CAST(${transactions.amount} AS NUMERIC) < 0 THEN ABS(CAST(${transactions.amount} AS NUMERIC)) ELSE 0 END)`.mapWith(Number),
        })
        .from(transactions)
        .innerJoin(person, eq(person.id, transactions.personId))
        .innerJoin(accounts, eq(accounts.personId, person.id))
        .where(
          and(
            accountId ? eq(accounts.id, accountId) : undefined,
            eq(person.userExternalId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          )
        )
        .groupBy(transactions.date)
        .orderBy(transactions.date);

      const days = fillMissingDays(
        activeDays,
        startDate,
        endDate,
      );

      return c.json({
        data: {
          remainingAmount: currentPeriod.remaining,
          remainingChange,
          incomeAmount: currentPeriod.income,
          incomeChange,
          expensesAmount: currentPeriod.expenses,
          expensesChange,
          categories: finalCategories,
          days,
        },
      });
    },
  );

export default app;
