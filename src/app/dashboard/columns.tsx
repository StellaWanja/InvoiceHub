"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Invoices, Customers } from "@/db/schema";
import { cn } from "@/lib/utils";

export interface Invoice {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "createTimestamp",
    header: "Date",
    cell: ({ row }) => (
      <Link
        href={`/invoices/${row.original.invoice.id}`}
        className="block font-semibold p-4 text-left"
      >
        {new Date(row.original.invoice.createTimestamp).toLocaleDateString()}
      </Link>
    ),
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => (
      <Link
        href={`/invoices/${row.original.invoice.id}`}
        className="block font-semibold p-4"
      >
        {row.original.invoice.customer.name}
      </Link>
    ),
  },
  {
    accessorKey: "customer.email",
    header: "Email",
    cell: ({ row }) => (
      <Link href={`/invoices/${row.original.invoice.id}`} className="block p-2 text-left ">
        {row.original.invoice.customer.email}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Link href={`/invoices/${row.original.invoice.id}`} className="block p-4 text-center">
        <Badge
          className={cn(
            "rounded-full capitalize",
            row.original.invoice.status === "open" && "bg-blue-500",
            row.original.invoice.status === "paid" && "bg-green-500",
            row.original.invoice.status === "void" && "bg-zinc-700",
            row.original.invoice.status === "uncollectible" && "bg-red-600"
          )}
        >
          {row.original.invoice.status}
        </Badge>
      </Link>
    ),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <Link
        href={`/invoices/${row.original.invoice.id}`}
        className="block font-semibold text-right p-4"
      >
        ${(row.original.invoice.value / 100).toFixed(2)}
      </Link>
    ),
  },
];
