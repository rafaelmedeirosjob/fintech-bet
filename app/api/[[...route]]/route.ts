import { Hono } from "hono"
import { handle } from "hono/vercel";
import summary from "./controllers/summary";
import accounts from "./controllers/accounts";
import payments from "./controllers/payments";
import users from "./controllers/users";
import transactions from "./controllers/transactions";
import subscriptions from "./controllers/subscriptions";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/summary", summary)
  .route("/accounts", accounts)
  .route("/payments", payments)
  .route("/users", users)
  .route("/transactions", transactions)
  .route("/subscriptions", subscriptions)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
