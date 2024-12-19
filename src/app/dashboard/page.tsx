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
        {/* <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4 hidden md:table-cell">
                Date
              </TableHead>
              <TableHead className="p-4 hidden sm:table-cell">
                Customer
              </TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="text-center p-4 hidden sm:table-cell">
                Status
              </TableHead>
              <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(
              ({ id, createTimestamp, value, status, customer }) => (
                <TableRow key={id}>
                  <TableCell className="hidden md:table-cell font-medium text-left p-0">
                    <Link
                      href={`/invoices/${id}`}
                      className="block font-semibold p-4"
                    >
                      {new Date(createTimestamp).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0 hidden sm:table-cell">
                    <Link
                      href={`/invoices/${id}`}
                      className="block font-semibold p-4"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link className="block p-4" href={`/invoices/${id}`}>
                      {customer.email}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center p-0 hidden sm:table-cell">
                    <Link className="block p-4" href={`/invoices/${id}`}>
                      <Badge
                        className={cn(
                          "rounded-full capitalize",
                          status === "open" && "bg-blue-500",
                          status === "paid" && "bg-green-500",
                          status === "void" && "bg-zinc-700",
                          status === "uncollectible" && "bg-red-600"
                        )}
                      >
                        {status}
                      </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right p-0">
                    <Link
                      href={`/invoices/${id}`}
                      className="block font-semibold p-4"
                    >
                      ${(value / 100).toFixed(2)}
                    </Link>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table> */}
      </Container>
    </main>
  );
}
