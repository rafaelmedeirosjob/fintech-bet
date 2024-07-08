import { number, z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { address, users, person } from "@/db/schema";
import { Citrus } from "lucide-react";
import { FaCity } from "react-icons/fa";

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
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      console.log("ola")
      console.log(auth)
      const [data] = await db
        .select({
          id: users.id,
          documentNumber: person.documentNumber,
          phoneNumber: person.phoneNumber,
          fullName: person.fullName,
          email: users.email,
          motherName: person.motherName,
          socialName: person.socialName,
          birthDate: person.birthDate,
          isPoliticallyExposedPerson: person.isPoliticallyExposedPerson,
          postalCode: address.postalCode,
          street: address.street,
          addressComplement: address.addressComplement,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state
        })
        .from(users)
        .leftJoin(person, eq(users.id, person.userId))
        .leftJoin(address, eq(person.addressId, address.id))
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

      console.log('Saving user data...');
      const [data2] = await db.insert(users).values({
        id: createId(),
        email: values.email,
        emailVerified: "true",
        image: "",
        password: "",
        role: "user",
        userExternalId: auth.userId
      }).returning();

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
        latitude: values.latitude
      }).returning();

      console.log('Saving users data...');
      const [data] = await db.insert(person).values({
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
        userId: data2.id,
        addressId: data1.id
      }).returning();
      
      console.log(data)


      console.log(data1)

      console.log(data2)


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
        .update(person)
        .set({
          documentNumber: values.documentNumber,
          email: values.email,
          phoneNumber: values.phoneNumber,
          motherName: values.motherName,
          fullName: values.fullName,
          socialName: values.socialName,
          birthDate: values.birthDate,
        })
        .where(
          and(
            eq(person.userId, id)
          ),
        )
        .returning();
        const addressId = data.addressId == null ? "" : data.addressId;
        const [data2] = await db
        .update(address)
        .set({
          postalCode: values.postalCode,
          street: values.street,
          number: values.number,
          addressComplement: values.addressComplement,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
        })
        .where(
          and(
            eq(address.id, addressId)
          )
        )
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }


      return c.json({});
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
