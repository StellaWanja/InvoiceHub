"use client";

import { SyntheticEvent, useState } from "react";
import Form from "next/form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createAction } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import Container from "@/components/Container";

export default function NewInvoice() {
  const [formStatus, setFormStatus] = useState("ready");

  async function handleSubmit(event: SyntheticEvent) {
    if (formStatus === "pending") {
      event.preventDefault();
      return;
    }
    setFormStatus("pending");
  }

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-semibold">Create Invoice</h1>
        </div>

        <Form
          action={createAction}
          onSubmit={handleSubmit}
          className="grid gap-4 max-w-xs"
        >
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
            <SubmitButton />
          </div>
        </Form>
      </Container>
    </main>
  );
}
