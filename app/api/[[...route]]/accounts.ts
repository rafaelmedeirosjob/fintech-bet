import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema, person, users, address } from "@/db/schema";

// Definição do schema combinado
const insertPersonSchema = z.object({
  documentNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  motherName: z.string().optional(),
  socialName: z.string().optional(),
  birthDate: z.string().optional(),
  isPoliticallyExposedPerson: z.string().optional(),
});

const insertAddressSchema = z.object({
  postalCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
});

// Schema combinado
const combinedSchema = z.object({
  ...insertPersonSchema.shape,
  ...insertAddressSchema.shape,
});


const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .select({
          id: accounts.id,
          amount: accounts.amount,
          pendingAmount: accounts.pendingAmount,
          name: person.fullName,
          documentNumber: accounts.documentNumber,
          status: accounts.status
        })
        .from(accounts)
        .innerJoin(person, eq(person.id, accounts.personId))
        .where(
          and(
            eq(person.userExternalId, auth.userId),
            isNull(person.userId)
          ),
        );
        console.log(data)
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
          id: accounts.id,
          documentNumber: accounts.documentNumber,
        })
        .from(accounts)
        .innerJoin(person, eq(person.id, accounts.personId))
        .where(
          and(
            eq(accounts.id, id)
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
    zValidator("json", combinedSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [dataAddress] = await db.insert(address).values({
        id: createId(),
        postalCode: values.postalCode,
        street: values.number,
        number: values.number,
        addressComplement: values.addressComplement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        longitude: values.longitude,
        latitude: values.latitude
      }).returning();

      console.log('Saving users data...');
      const [dataPerson] = await db.insert(person).values({
        id: createId(),
        userExternalId: auth.userId,
        documentNumber: values.documentNumber,
        phoneNumber: values.phoneNumber,
        fullName: values.fullName,
        email: values.email,
        motherName: values.motherName,
        socialName: values.socialName,
        birthDate: values.birthDate,
        isPoliticallyExposedPerson: "false",
        userId: null,
        addressId: dataAddress.id
      }).returning();

      const [dataAccount] = await db.insert(accounts).values({
        id: createId(),
        status: "PROCESSING",
        documentNumber: dataPerson.documentNumber == null  ? "" : dataPerson.documentNumber,
        participant: "",
        accountOnboardingType: "",
        branch: "",
        account: "",
        accountType: "",
        personId: dataPerson.id == null  ? "" : dataPerson.id
      }).returning();

      return c.json({ dataAccount });
    })
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id,
        });

      return c.json({ data });
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertAccountSchema.pick({
        documentNumber: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(
          and(
            eq(accounts.id, id),
          ),
        )
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
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
        .delete(accounts)
        .where(
          and(
            eq(accounts.id, id),
          ),
        )
        .returning({
          id: accounts.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  );

export default app;
