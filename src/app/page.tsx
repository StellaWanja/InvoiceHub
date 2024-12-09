import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center gap-6 h-[100vh] text-center max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">InvoiceHub</h1>
      <p>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
    </main>
  );
}
