import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

import Container from "@/components/Container";
import Logo from "../../public/logo.svg";

const Header = () => {
  return (
    <header className="mt-8 mb-12">
      <Container>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 font-bold">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src={Logo} alt="InvoiceHub logo" width={30} height={30} />
              <p>InvoiceHub</p>
            </Link>
          </div>
          <div className="font-bold hover:text-gray-600">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
