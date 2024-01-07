"use client";

import { Button } from "./button";
import { useSession, signIn } from "next-auth/react";

export const LoginForm = () => {
  const { data: session } = useSession();
  console.log(session);
  return !session?.user ? (
    <>
      <form
        action={async () => {
          await signIn("google");
        }}>
        <Button>Sign in via Google</Button>
      </form>
      <form
        action={async () => {
          await signIn("reddit");
        }}>
        <Button>Sign in via Reddit</Button>
      </form>
    </>
  ) : (
    ""
  );
};
