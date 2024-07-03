import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { address, users } from "@/db/schema";

// Definição do schema combinado
const insertUserSchema = z.object({
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
  ...insertUserSchema.shape,
  ...insertAddressSchema.shape,
});

const app = new Hono()
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
          id: users.id,
          documentNumber: users.documentNumber,
          phoneNumber: users.phoneNumber,
          fullName: users.fullName,
          email: users.email,
          motherName: users.motherName,
          socialName: users.socialName,
          birthDate: users.birthDate,
          isPoliticallyExposedPerson: users.isPoliticallyExposedPerson
        })
        .from(users)
        .where(
          and(
            eq(users.userExternalId, auth.userId),
            eq(users.id, id)
          ),
        );
      
      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .get(
    "/main",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db
        .select({
          id: users.id,
          documentNumber: users.documentNumber,
          phoneNumber: users.phoneNumber,
          fullName: users.fullName,
          email: users.email,
          motherName: users.motherName,
          socialName: users.socialName,
          birthDate: users.birthDate,
          isPoliticallyExposedPerson: users.isPoliticallyExposedPerson
        })
        .from(users)
        .where(
          and(
            eq(users.userExternalId, auth.userId)
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
      console.log(auth)
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      console.log('Saving users data...');
      const [data] = await db.insert(users).values({
        id: createId(),
        userExternalId: auth.userId,
        documentNumber: values.documentNumber,
        phoneNumber: values.phoneNumber,
        fullName: values.fullName,
        email: values.email,
        motherName: values.motherName,
        socialName: values.socialName,
        birthDate: values.birthDate,
        isPoliticallyExposedPerson: "false"

      }).returning();
      
      console.log(data)
      console.log('Saving address data...');
      const [data1] = await db.insert(address).values({
        id: createId(),
        postalCode: values.postalCode,
        street: values.number,
        number: values.number,
        addressComplement: values.addressComplement,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        longitude: values.longitude,
        latitude: values.latitude,
        userId: data.id
      }).returning();

      console.log(data1)


      return c.json({ data });
  })
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
      combinedSchema
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
        .update(users)
        .set(values)
        .where(
          and(
            eq(users.userExternalId, auth.userId),
            eq(users.id, id),
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
        .delete(users)
        .where(
          and(
            eq(users.userExternalId, auth.userId),
            eq(users.id, id),
          ),
        )
        .returning({
          id: users.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    },
  );

export default app;
