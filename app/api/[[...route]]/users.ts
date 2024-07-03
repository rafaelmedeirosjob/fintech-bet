import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { users, insertUserSchema } from "@/db/schema";

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
    zValidator("json", insertUserSchema.pick({
      documentNumber: true,
      phoneNumber: true,
      fullName: true,
      email: true,
      motherName: true,
      socialName: true,
      birthDate: true,
      isPoliticallyExposedPerson: true
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
      console.log(auth)
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const [data] = await db.insert(users).values({
        id: createId(),
        userExternalId: auth.userId,
        ...values,
      }).returning();

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
      insertUserSchema.pick({
        documentNumber: true,
        phoneNumber: true,
        fullName: true,
        email: true,
        motherName: true,
        socialName: true,
        birthDate: true,
        isPoliticallyExposedPerson: true
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
