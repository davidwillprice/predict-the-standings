"use client";

import { signOut } from "next-auth/react";

import { Button } from "@components/button/button";

export const SignOutBtn = () => (
  <Button
    onClick={async () => {
      await signOut({ callbackUrl: "/" });
    }}>
    Sign Out
  </Button>
);
