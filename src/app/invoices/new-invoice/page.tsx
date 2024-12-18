"use client";

import { SyntheticEvent, useState } from "react";
import Form from "next/form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createAction } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="h-full flex justify-center items-center">
      <Container className="w-full">
        <Card className="w-full ">
          <CardHeader>
            <CardTitle className="flex justify-between mb-6">
              <h1 className="text-3xl font-semibold">Create Invoice</h1>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form
              action={createAction}
              onSubmit={handleSubmit}
              className="grid gap-6 "
            >
              <div className="w-full">
                <Label
                  htmlFor="name"
                  className="font-semibold text-md block mb-2"
                >
                  Billing Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  className="border-2 border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="font-semibold text-md block mb-2"
                >
                  Billing Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className="border-2 border-gray-300 rounded-md "
                />
              </div>
              <div>
                <Label
                  htmlFor="value"
                  className="font-semibold text-md block mb-2"
                >
                  Value
                </Label>
                <Input
                  type="text"
                  id="value"
                  name="value"
                  className="border-2 border-gray-300 rounded-md "
                />
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="font-semibold text-md block mb-2"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="border-2 border-gray-300 rounded-md "
                ></Textarea>
              </div>
              <div>
                <SubmitButton />
              </div>
            </Form>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
