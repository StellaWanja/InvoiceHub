import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { ClerkAPIError } from "@clerk/types";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type FormProps = {
  pendingVerification: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  emailAddress: string;
  setEmailAddress: (emailAddress: string) => void;
  showPassword: boolean;
  password: string;
  setPassword: (password: string) => void;
  setShowPassword: (showPassword: boolean) => void;
  errors: ClerkAPIError[] | undefined;
  handleVerificationSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  code: string;
  setCode: (code: string) => void;
};

function Form({ ...props }: FormProps) {
  const {
    pendingVerification,
    handleSubmit,
    emailAddress,
    setEmailAddress,
    showPassword,
    password,
    setPassword,
    setShowPassword,
    errors,
    handleVerificationSubmit,
    code,
    setCode,
  } = props;

  return (
    <>
      {/* filling sign up form */}
      {!pendingVerification ? (
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
            Sign Up
          </Button>
        </form>
      ) : (
        // verification code
        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter verification code"
              required
            />
          </div>
          {errors && (
            <Alert variant="destructive">
              <AlertDescription>{errors[0].message}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Verify Email
          </Button>
        </form>
      )}
    </>
  );
}

export default Form;
