import { Hono } from "hono"
import { handle } from "hono/vercel";
import summary from "./summary";
import accounts from "./accounts";
import users from "./users";
import transactions from "./transactions";
import subscriptions from "./subscriptions";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/summary", summary)
  .route("/accounts", accounts)
  .route("/users", users)
  .route("/transactions", transactions)
  .route("/subscriptions", subscriptions)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
