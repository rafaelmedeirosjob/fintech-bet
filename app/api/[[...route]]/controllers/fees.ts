import { z } from "zod";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { fees } from "@/db/schema";


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
        id: fees.id,
        type: fees.type,
        origin: fees.origin,
        value: fees.value
      })
      .from(fees);
      console.log(data)
    return c.json({ data });
  })

export default app;
