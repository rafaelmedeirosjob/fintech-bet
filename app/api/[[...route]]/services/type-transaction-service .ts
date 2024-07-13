import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { typeTransactions, fees } from "@/db/schema";


export const getTypeTransactionFromType = async (type : string) => {

  const data = await db
  .select({
    id: typeTransactions.id,
    name: typeTransactions.name,
    description: typeTransactions.description,
    feeAmount: fees.value,
    feeId: fees.id
  })
  .from(typeTransactions)
  .innerJoin(fees, eq(typeTransactions.feeId, fees.id))
  .where(
    and(
      eq(typeTransactions.name, type)
    ),
  );
  return data;
  
}


