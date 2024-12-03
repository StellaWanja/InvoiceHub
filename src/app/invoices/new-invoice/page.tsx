import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <main className="flex flex-col justify-center gap-6 h-full max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Create Invoice</h1>
      </div>

      <form className="grid gap-4 max-w-xs">
        <div>
          <Label htmlFor="name" className="font-semibold text-sm block mb-2">
            Billing Name
          </Label>
          <Input type="text" id="name" name="name" />
        </div>
        <div>
          <Label htmlFor="email" className="font-semibold text-sm block mb-2">
            Billing Email
          </Label>
          <Input type="email" id="email" name="email" />
        </div>
        <div>
          <Label htmlFor="value" className="font-semibold text-sm block mb-2">
            Value
          </Label>
          <Input type="text" id="value" name="value" />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="font-semibold text-sm block mb-2"
          >
            Description
          </Label>
          <Textarea id="description" name="description"></Textarea>
        </div>
        <div>
        <Button className="w-full font-semibold">Submit</Button>
        </div>
      </form>
    </main>
  );
}
