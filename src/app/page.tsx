import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center gap-6  text-center max-w-5xl mx-auto px-4 ">
      <h1 className="text-5xl font-bold">InvoiceHub</h1>
      <p>Manage invoices effortlessly with InvoiceHub — the all-in-one solution for tracking invoices.</p>
      <p>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
    </main>
  );
}
