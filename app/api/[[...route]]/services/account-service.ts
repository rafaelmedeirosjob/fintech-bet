import { z } from "zod";
import { Hono } from "hono";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema, person, transactions, address } from "@/db/schema";
import { getTypeTransactionFromType } from "./type-transaction-service ";

// Definição do schema combinado
const insertPersonSchema = z.object({
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
  ...insertPersonSchema.shape,
  ...insertAddressSchema.shape,
});

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
    status: "PROCESSING",
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
    const [dataTransactions] = await db.insert(transactions).values({
      id: createId(),
      amount: Number(typeTransaction.feeAmount),
      notes: "Taxa relacionada a criação de conta",
      feeId: typeTransaction.feeId,
      typeTransactionId: typeTransaction.id,
      personId: dataPerson.id == null  ? "" : dataPerson.id
    }).returning();

    console.log(dataTransactions)
  }

  
  return dataAccount;
  
}


