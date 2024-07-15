import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { saveQrCode } from "../services/payment-service";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";

// Definição do schema combinado
const insertQrCodeSchema = z.object({
  id: z.string(),
  linkQrCode: z.string(),
});

// Schema combinado
const combinedSchema = z.object({
  ...insertQrCodeSchema.shape,
});


const app = new Hono()
  .post(
    "/qrCode",
    clerkMiddleware(),
    zValidator("json", combinedSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const response = await saveQrCode(values);
      return c.json({ response });
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

export default app;
