"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Form from "./Form";

function SignUp() {
  const { isLoaded, setActive, signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = React.useState<ClerkAPIError[]>();
  const [showPassword, setShowPassword] = useState(true);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Clear any errors that may have occurred during previous form submission
    setErrors(undefined);

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }

  async function handleVerificationSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        return <div>Unable to signup</div>;
      }

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }

  return (
    <div className="w-full flex items-center justify-center bg-[#f5f4ff] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mx-auto size-10"
              viewBox="0 0 24 24"
            >
              <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1ZM14 8H8M16 12H8M13 16H8"></path>
            </svg>
            <h1 className="mt-4 text-xl font-medium tracking-tight text-neutral-950">
              Sign up to InvoiceHub
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form
            pendingVerification={pendingVerification}
            handleSubmit={handleSubmit}
            emailAddress={emailAddress}
            setEmailAddress={setEmailAddress}
            showPassword={showPassword}
            password={password}
            setPassword={setPassword}
            setShowPassword={setShowPassword}
            errors={errors}
            handleVerificationSubmit={handleVerificationSubmit}
            code={code}
            setCode={setCode}
          />
        </CardContent>
        
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
