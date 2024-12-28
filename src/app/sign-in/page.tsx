"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import SigninForm from "./Form";

function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = React.useState<ClerkAPIError[]>();
  const [showPassword, setShowPassword] = useState(false);

  if (!isLoaded) {
    return <Spinner />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Clear any errors that may have occurred during previous form submission
    setErrors(undefined);

    if (!isLoaded) {
      return <Spinner />;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.error(JSON.stringify(err, null, 2));
    }
  }

  async function handleGoogleSignin() {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
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
              Sign in to InvoiceHub
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SigninForm
            handleSubmit={handleSubmit}
            emailAddress={emailAddress}
            setEmailAddress={setEmailAddress}
            showPassword={showPassword}
            password={password}
            setPassword={setPassword}
            setShowPassword={setShowPassword}
            errors={errors}
          />
        </CardContent>

        <CardFooter className="justify-center">
          <div className="rounded-xl bg-neutral-100 p-5 w-full">
            <p className="mb-4 text-center text-sm/5 text-neutral-500">
              Alternatively, log in with these platforms
            </p>
            <div className="space-y-2">
              <Button
                className="w-full font-bold flex gap-2"
                variant={"outline"}
                onClick={handleGoogleSignin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="size-4"
                >
                  <g clipPath="url(#a)">
                    <path
                      fill="currentColor"
                      d="M8.32 7.28v2.187h5.227c-.16 1.226-.57 2.124-1.192 2.755-.764.765-1.955 1.6-4.035 1.6-3.218 0-5.733-2.595-5.733-5.813 0-3.218 2.515-5.814 5.733-5.814 1.733 0 3.005.685 3.938 1.565l1.538-1.538C12.498.96 10.756 0 8.32 0 3.91 0 .205 3.591.205 8s3.706 8 8.115 8c2.382 0 4.178-.782 5.582-2.24 1.44-1.44 1.893-3.475 1.893-5.111 0-.507-.035-.978-.115-1.369H8.32Z"
                    />
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="#fff" d="M0 0h16v16H0z" />
                    </clipPath>
                  </defs>
                </svg>
                Log in with Google
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignInPage;
