"use server";

import { redirect } from "next/navigation";
import { auth } from '@clerk/nextjs/server'

import { db } from "@/db";
import { Invoices } from "@/db/schema";

export async function createAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) return ;

  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;

  await db.insert(Invoices).values({ value, description });
}
