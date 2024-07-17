import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts, person, transactions, address } from "@/db/schema";
import { getTypeTransactionFromType } from "./type-transaction-service ";



export const saveAccount = async (userExternalAuthId: any, values: any, userId : any) => {

  const [dataAddress] = await db.insert(address).values({
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
  const [dataPerson] = await db.insert(person).values({
    id: createId(),
    userExternalId: userExternalAuthId,
    documentNumber: values.documentNumber,
    phoneNumber: values.phoneNumber,
    fullName: values.fullName,
    email: values.email,
    motherName: values.motherName,
    socialName: values.socialName,
    birthDate: values.birthDate,
    isPoliticallyExposedPerson: "false",
    userId: userId,
    addressId: dataAddress.id
  }).returning();

  const [dataAccount] = await db.insert(accounts).values({
    id: createId(),
    status: "Pendente",
    pixStatus: "Inativo",
    amount: "0.00",
    documentNumber: dataPerson.documentNumber == null  ? "" : dataPerson.documentNumber,
    participant: "",
    accountOnboardingType: "",
    branch: "",
    account: "",
    accountType: "",
    personId: dataPerson.id == null  ? "" : dataPerson.id
  }).returning();

  if(userId == null){
    const [typeTransaction] = await getTypeTransactionFromType("create-account");
    const feeAmout = typeTransaction.feeAmount != null  ? "-"+typeTransaction.feeAmount.toString() : "0.00"
    const [dataTransactions] = await db.insert(transactions).values({
      id: createId(),
      amount: feeAmout.toString(),
      status: "FINALIZADO",
      notes: "Taxa relacionada a criação de conta",
      feeId: typeTransaction.feeId,
      typeTransactionId: typeTransaction.id,
      personId: dataPerson.id == null  ? "" : dataPerson.id
    }).returning();

    console.log(dataTransactions)
  }

  
  return dataAccount;
  
}


