import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { typeTransactions, fees } from "@/db/schema";
import { string } from "zod";

const qrCode = {
  linkQrCode: string,
  id: string
}

export const  saveQrCode = async (qrCode : any) => {

  const data = null
  return data;
  
}


