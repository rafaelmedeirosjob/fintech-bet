import { config } from "dotenv";
import { subDays } from "date-fns";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { typeTransactions, accounts,fees, transactions } from "@/db/schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = "user_2g1JOKQh3QUlqivKbp70wEJobvd";
const SEED_FEES = [
  { id: "1", type: "value", origin: "create-account", value: '6.00' },
  { id: "2", type: "value", origin: "withdraw-zero-fee", value: '10.00' },
  { id: "3", type: "percent", origin: "withdraw-main-account", value: '15.00' },
  { id: "4", type: "percent", origin: "transfer-between-account", value: '0.01' }
];

const SEED_TYPE_TRANSACTIONS = [
  { id: "1", name: "create-account", description: "Criação de conta", feeId: "1" },
  { id: "2", name: "withdraw-zero-fee", description: "Saque sem taxas", feeId: "2" },
  { id: "3", name: "withdraw-main-account", description: "Retirada da plataforma", feeId: "3"  },
  { id: "4", name: "deposit-main-account", description: "Depósito na plataforma", feeId: null },
];





const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

const main = async () => {
  try {
    // Reset database
    await db.delete(transactions).execute();
    await db.delete(accounts).execute();
    await db.delete(typeTransactions).execute();
    // Seed categories
    await db.insert(fees).values(SEED_FEES).execute();
    await db.insert(typeTransactions).values(SEED_TYPE_TRANSACTIONS).execute();
    // Seed accounts
    // Seed transactions

  } catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  }
};

main();
