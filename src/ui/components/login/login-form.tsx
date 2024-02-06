"use client";

import { Button } from "@components/button/button";
import { useSession, signIn } from "next-auth/react";

import styles from "@components/login/login.module.scss";

export const LoginForm = () => {
  const { data: session } = useSession();
  return !session?.user ? (
    <>
      <div className={styles.login}>
        {/**@todo Add icons for each login */}
        <Button
          onClick={async () => {
            await signIn("google", { callbackUrl: "/profile" });
          }}>
          Sign in via Google
        </Button>
        <Button
          onClick={async () => {
            await signIn("twitter", { callbackUrl: "/profile" });
          }}>
          Sign in via Twitter
        </Button>
        <Button
          onClick={async () => {
            await signIn("reddit", { callbackUrl: "/profile" });
          }}>
          Sign in via Reddit
        </Button>
      </div>
    </>
  ) : (
    ""
  );
};
