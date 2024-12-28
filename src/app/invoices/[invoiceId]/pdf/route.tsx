import React from "react";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { renderToStream } from "@react-pdf/renderer";

import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import { WEB_TITLE } from "@/constants/invoices";
import InvoiceDocument from "./InvoiceDocument";

type tParams = Promise<{ invoiceId: string }>;

export const generateMetadata = async (props: { params: tParams }) => {
  return {
    title: `${WEB_TITLE} #${(await props.params).invoiceId} PDF`,
  };
};

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  const { userId } = await auth();
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

  const stream = await renderToStream(<InvoiceDocument {...invoice} />);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
