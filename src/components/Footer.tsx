import React from "react";
import Container from "@/components/Container";

const Footer = () => {
  return (
    <header className="mt-6 mb-8">
      <Container>
        <p className="text-sm text-center">InvoiceHub &copy; {new Date().getFullYear()}</p>
      </Container>
    </header>
  );
};

export default Footer;
