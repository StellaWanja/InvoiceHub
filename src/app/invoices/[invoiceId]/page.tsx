import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import InvoiceData from "./Invoice";
import { WEB_TITLE } from "@/constants/invoices";

type tParams = Promise<{ invoiceId: string }>;

export const generateMetadata = async (props: { params: tParams }) => {
  return {
    title: `${WEB_TITLE} #${(await props.params).invoiceId}`,
  };
};

export default async function InvoicePage(props: { params: tParams }) {
  const { userId } = await auth();

  const params = await props.params;
  const invoiceId = Number.parseInt(params.invoiceId);

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

  // result not found
  if (!result) return notFound();

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <InvoiceData invoice={invoice} />;
}
