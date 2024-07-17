import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { usersBets, transactions} from "@/db/schema";
import { getTypeTransactionFromType } from "./type-transaction-service ";



export const saveWithdrawZeroFee = async (values: any) => {

    const [userBet] = await db.insert(usersBets).values({
      id: createId(),
      bettingHouse: values.bettingHouse,
      reason: values.reason,
      login: values.login,
      password: values.password
    }).returning();

    console.log(userBet)

    const [typeTransaction] = await getTypeTransactionFromType("withdraw-zero-fee");
    const feeAmout = typeTransaction.feeAmount != null  ? "-"+typeTransaction.feeAmount.toString() : "0.00"
    const [dataTransactionsFee] = await db.insert(transactions).values({
      id: createId(),
      amount: feeAmout.toString(),
      status: "Finalizado",
      notes: "Taxa relacionada a criação de conta",
      feeId: typeTransaction.feeId,
      typeTransactionId: typeTransaction.id,
      personId: values.personId == null  ? "" : values.personId,
      usersBetsId: userBet.id
    }).returning();

    console.log(dataTransactionsFee)

    const [dataTransactionsWithdrawZero] = await db.insert(transactions).values({
      id: createId(),
      amount: values.amount,
      status: "Pendente",
      notes: "Aguardando equipe realizar aprovação do saque",
      typeTransactionId: typeTransaction.id,
      personId: values.personId == null  ? "" : values.personId,
      usersBetsId: userBet.id
    }).returning();

    console.log(dataTransactionsWithdrawZero)

  return userBet;
  
}



