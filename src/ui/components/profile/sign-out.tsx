"use client";

import { signOut } from "next-auth/react";

import { Button } from "@components/button/button";
import Icon from "@svgs/icons/sq-icon";

export const SignOutBtn = () => (
  <Button
    onClick={async () => {
      await signOut({ callbackUrl: "/" });
    }}>
    Sign Out
    <Icon strokeWidth={2} type="logout" />
  </Button>
);
