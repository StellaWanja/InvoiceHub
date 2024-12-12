import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import InvoiceData from "./Invoice";

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = await auth();
  const invoiceId = await parseInt(params.invoiceId);

  if (!userId) return;

  // invalid invoice id
  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  console.log(result);

  // result not found
  if (!result) return notFound();

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <InvoiceData invoice={invoice} />;
}
