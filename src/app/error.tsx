"use client";

import NextError from "next/error";

export default function Error({ error }: { error: Error }) {
  return <NextError title={error.message} statusCode={500} />;
}
