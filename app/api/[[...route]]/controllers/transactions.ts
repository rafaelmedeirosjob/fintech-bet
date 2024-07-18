import { z } from "zod";
import { Hono } from "hono";
import { parse, subDays } from "date-fns";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { 
  transactions, 
  person,
  insertTransactionSchema, 
  typeTransactions,
  accounts,
  fees
} from "@/db/schema";

const app = new Hono()
  .get(
    "/",
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    clerkMiddleware(),
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

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          type: typeTransactions.description,
          idType: typeTransactions.id,
          status: transactions.status,
          amount: transactions.amount,
          notes: transactions.notes,
          documentNumber: person.documentNumber,
          accountId: accounts.id
        })
        .from(transactions)
        .innerJoin(person, eq(transactions.personId, person.id))
        .innerJoin(accounts, eq(accounts.personId, transactions.personId))
        .leftJoin(typeTransactions, eq(transactions.typeTransactionId, typeTransactions.id))
        .where(
          and(
            eq(person.userExternalId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
  })
  .get(
    "/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          type: typeTransactions.description,
          status: transactions.status,
          amount: transactions.amount,
          notes: transactions.notes,
          documentNumber: person.documentNumber
        })
        .from(transactions)
        .innerJoin(person, eq(accounts.personId, person.id))
        .leftJoin(typeTransactions, eq(transactions.typeTransactionId, typeTransactions.id))
        .where(
          and(
            eq(transactions.id, id),
            eq(person.userExternalId, auth.userId),
          ),
        );
      
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
      id: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db.insert(transactions).values({
        id: createId(),
        ...values,
      }).returning();

      return c.json({ data });
  })
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        }),
      ),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();
        
      return c.json({ data });
    },
  )
  // .post(
  //   "/bulk-delete",
  //   clerkMiddleware(),
  //   zValidator(
  //     "json",
  //     z.object({
  //       ids: z.array(z.string()),
  //     }),
  //   ),
  //   async (c) => {
  //     const auth = getAuth(c);
  //     const values = c.req.valid("json");

  //     if (!auth?.userId) {
  //       return c.json({ error: "Unauthorized" }, 401);
  //     }

  //     const transactionsToDelete = db.$with("transactions_to_delete").as(
  //       db.select({ id: transactions.id }).from(transactions)
  //         .innerJoin(accounts, eq(transactions.accountId, accounts.id))
  //         .innerJoin(person, eq(accounts.personId, person.id))
  //         .where(and(
  //           inArray(transactions.id, values.ids),
  //           eq(person.userId, auth.userId),
  //         )),
  //     );

  //     const data = await db
  //       .with(transactionsToDelete)
  //       .delete(transactions)
  //       .where(
  //         inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
  //       )
  //       .returning({
  //         id: transactions.id,
  //       });

  //     return c.json({ data });
  //   },
  // )
  // .patch(
  //   "/:id",
  //   clerkMiddleware(),
  //   zValidator(
  //     "param",
  //     z.object({
  //       id: z.string().optional(),
  //     }),
  //   ),
  //   zValidator(
  //     "json",
  //     insertTransactionSchema.omit({
  //       id: true,
  //     })
  //   ),
  //   async (c) => {
  //     const auth = getAuth(c);
  //     const { id } = c.req.valid("param");
  //     const values = c.req.valid("json");

  //     if (!id) {
  //       return c.json({ error: "Missing id" }, 400);
  //     }

  //     if (!auth?.userId) {
  //       return c.json({ error: "Unauthorized" }, 401);
  //     }

  //     const transactionsToUpdate = db.$with("transactions_to_update").as(
  //       db.select({ id: transactions.id })
  //         .from(transactions)
  //         .innerJoin(accounts, eq(transactions.accountId, accounts.id))
  //         .innerJoin(person, eq(accounts.personId, person.id))
  //         .where(and(
  //           eq(transactions.id, id),
  //           eq(person.userExternalId, auth.userId),
  //         )),
  //     );

  //     const [data] = await db
  //       .with(transactionsToUpdate)
  //       .update(transactions)
  //       .set(values)
  //       .where(
  //         inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
  //       )
  //       .returning();
        

  //     if (!data) {
  //       return c.json({ error: "Not found" }, 404);
  //     }

  //     return c.json({ data });
  //   },
  // )
  // .delete(
  //   "/:id",
  //   clerkMiddleware(),
  //   zValidator(
  //     "param",
  //     z.object({
  //       id: z.string().optional(),
  //     }),
  //   ),
  //   async (c) => {
  //     const auth = getAuth(c);
  //     const { id } = c.req.valid("param");

  //     if (!id) {
  //       return c.json({ error: "Missing id" }, 400);
  //     }

  //     if (!auth?.userId) {
  //       return c.json({ error: "Unauthorized" }, 401);
  //     }

  //     const transactionsToDelete = db.$with("transactions_to_delete").as(
  //       db.select({ id: transactions.id })
  //         .from(transactions)
  //         .innerJoin(accounts, eq(transactions.accountId, accounts.id))
  //         .innerJoin(person, eq(accounts.personId, person.id))
  //         .where(and(
  //           eq(transactions.id, id),
  //           eq(person.userExternalId, auth.userId),
  //         )),
  //     );

  //     const [data] = await db
  //       .with(transactionsToDelete)
  //       .delete(transactions)
  //       .where(
  //         inArray(
  //           transactions.id,
  //           sql`(select id from ${transactionsToDelete})`
  //         ),
  //       )
  //       .returning({
  //         id: transactions.id,
  //       });

  //     if (!data) {
  //       return c.json({ error: "Not found" }, 404);
  //     }

  //     return c.json({ data });
  //   },
  // );

export default app;
