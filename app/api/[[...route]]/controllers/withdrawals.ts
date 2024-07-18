import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { saveQrCode } from "../services/payment-service";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { saveWithdrawZeroFee } from "../services/withdraw-service";

// Definição do schema combinado
const insertWithdrawalsZeroSchema = z.object({
  personId: z.string(),
  bettingHouse: z.string(),
  login: z.string(), 
  amount: z.string(),
  password: z.string(),
  reason: z.string(),
});

// Schema combinado
const combinedSchema = z.object({
  ...insertWithdrawalsZeroSchema.shape,
});


const app = new Hono()
  .post(
    "/zero_fees",
    clerkMiddleware(),
    zValidator("json", combinedSchema),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      const response = await saveWithdrawZeroFee(values);
      return c.json({ response });
    })

export default app;
