import React, { Fragment } from "react";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToStream,
  Svg,
  Path,
  Line,
} from "@react-pdf/renderer";

import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import { WEB_TITLE } from "@/constants/invoices";

type tParams = Promise<{ invoiceId: string }>;

export const generateMetadata = async (props: { params: tParams }) => {
  return {
    title: `${WEB_TITLE} #${(await props.params).invoiceId} PDF`,
  };
};

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    width: 24,
    height: 24,
  },
  header: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    marginBottom: 28,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  invoiceContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 8,
  },
  line: {
    marginBottom: 16,
  },
  invoiceData: {
    fontSize: 12,
    fontStyle: "bold",
    textTransform: "capitalize",
  },
  label: {
    fontFamily: "Helvetica-Bold",
  },
  contentContainer: {
    marginTop: 24,
  },
  detailsTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    marginBottom: 12,
  },
  footer: { marginTop: "auto", textAlign: "center", marginBottom: 16 },
});

type InvoiceDataProps = typeof Invoices.$inferSelect & {
  customer: typeof Customers.$inferSelect;
};

// Create Document Component
const InvoiceDocument = ({
  id,
  value,
  description,
  customer,
  status,
  createTimestamp,
}: InvoiceDataProps) => (
  <Document>
    <Page size={"A5"} style={styles.page}>
      <View style={styles.header}>
        <Svg
          style={styles.logo}
          fill="#ffffff"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
          <Path d="M14 8H8" />
          <Path d="M16 12H8" />
          <Path d="M13 16H8" />
        </Svg>
        <Text>InvoiceHub</Text>
      </View>
      <Svg height="10" width="1000" style={styles.line}>
        <Line
          x1="0"
          y1="0"
          x2="300"
          y2="0"
          strokeWidth={2}
          stroke="text-gray-300"
        />
      </Svg>
      <Fragment>
        <View style={styles.invoiceContainer}>
          <Text style={styles.label}>Invoice No:</Text>
          <Text style={styles.invoiceData}>{id}</Text>
        </View>
        <View style={styles.invoiceContainer}>
          <Text style={styles.label}>Date: </Text>
          <Text style={styles.invoiceData}>
            {new Date(createTimestamp).toLocaleDateString()}
          </Text>
        </View>
      </Fragment>
      <View style={styles.contentContainer}>
        <Text style={styles.detailsTitle}>Invoice Details: </Text>
        <View style={styles.invoiceContainer}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.invoiceData}>{description}</Text>
        </View>
        <View style={styles.invoiceContainer}>
          <Text style={styles.label}>Value:</Text>
          <Text style={styles.invoiceData}>${value / 100}</Text>
        </View>
        <View style={styles.invoiceContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.invoiceData}>{status}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.detailsTitle}>Customer Info: </Text>
        <View style={styles.invoiceContainer}>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.invoiceData}>{customer.name}</Text>
        </View>
        <View style={styles.invoiceContainer}>
          <Text style={styles.label}>Customer Email:</Text>
          <Text style={styles.invoiceData}>{customer.email}</Text>
        </View>
      </View>

      <Text style={styles.footer}>Thank you for your business</Text>
    </Page>
  </Document>
);

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
