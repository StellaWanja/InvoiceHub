import React from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { ClerkAPIError } from "@clerk/types";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type FormProps = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  emailAddress: string;
  setEmailAddress: (emailAddress: string) => void;
  showPassword: boolean;
  password: string;
  setPassword: (password: string) => void;
  setShowPassword: (showPassword: boolean) => void;
  errors: ClerkAPIError[] | undefined;
};

const SigninForm = ({ ...props }: FormProps) => {
  const {
    handleSubmit,
    emailAddress,
    setEmailAddress,
    showPassword,
    password,
    setPassword,
    setShowPassword,
    errors,
  } = props;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-lg">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={emailAddress}
            onChange={(event) => setEmailAddress(event.target.value)}
            placeholder="Email"
            required
            className="border-2 border-gray-300 rounded-md "
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-lg">
            Password
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
              className="border-2 border-gray-300 rounded-md "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {errors && (
          <Alert variant="destructive">
            <AlertDescription>{errors[0].message}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <p className="text-sm text-center pt-4 text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default SigninForm;
