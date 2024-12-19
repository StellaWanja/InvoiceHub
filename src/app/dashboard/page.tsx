import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";

import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { WEB_TITLE } from "@/constants/invoices";
import { DataTable } from "./data-table";
import { columns, Invoice } from "./columns";

export const generateMetadata = async () => {
  return {
    title: `${WEB_TITLE} • Dashboard`,
  };
};

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) return;

  const dbResults = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.userId, userId));

  const invoices: Invoice[] = dbResults?.map(({ invoices, customers }) => ({
    invoice: {
      ...invoices,
      customer: customers,
    },
  }));

  return (
    <main className="h-full max-w-full overflow-hidden">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <p>
            <Button
              className="inline-flex gap-2 pl-0 mt-4 sm:mt-0"
              variant="ghost"
              asChild
            >
              <Link href="/invoices/new-invoice">
                <CirclePlus className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>

        <DataTable<Invoice> columns={columns} data={invoices} />
      </Container>
    </main>
  );
}
