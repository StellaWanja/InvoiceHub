"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { Customers, Invoices, Status } from "@/db/schema";

export async function createAction(formData: FormData) {
  const { userId } = await auth();

  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!userId) return;

  const [customer] = await db
    .insert(Customers)
    .values({ name, email, userId })
    .returning({ id: Customers.id });

  const results = await db
    .insert(Invoices)
    .values({ value, description, userId, customerId: customer.id })
    .returning({ id: Invoices.id });

  return redirect(`/invoices/${results[0].id}`);
}

export async function updateStatus(formData: FormData) {
  const { userId } = await auth();

  if (!userId) return;

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  await db
    .update(Invoices)
    .set({ status })
    .where(
      and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.userId, userId))
    );

  revalidatePath(`/invoices/${id}`, "page");
}

export async function deleteInvoice(formData: FormData) {
  const { userId } = await auth();

  if (!userId) return;

  const id = formData.get("id") as string;

  await db
    .delete(Invoices)
    .where(
      and(eq(Invoices.id, Number.parseInt(id)), eq(Invoices.userId, userId))
    );

  return redirect(`/dashboard`);
}
