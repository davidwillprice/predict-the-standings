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
        {/**Instagram provider seems to require a verified FB business account
         * Apple developer program costs $99py so can't add Apple provider*/}
        {/**@todo Add Patreon, Linkedin, and Spotify logins */}
        <Button
          onClick={async () => {
            await signIn("github", { callbackUrl: "/profile" });
          }}>
          Sign in via Github
        </Button>
        <Button
          onClick={async () => {
            await signIn("google", { callbackUrl: "/profile" });
          }}>
          Sign in via Google
        </Button>
        <Button
          onClick={async () => {
            await signIn("patreon", { callbackUrl: "/profile" });
          }}>
          Sign in via Patreon
        </Button>
        <Button
          onClick={async () => {
            await signIn("reddit", { callbackUrl: "/profile" });
          }}>
          Sign in via Reddit
        </Button>
        <Button
          onClick={async () => {
            await signIn("spotify", { callbackUrl: "/profile" });
          }}>
          Sign in via Spotify
        </Button>
        <Button
          onClick={async () => {
            await signIn("twitter", { callbackUrl: "/profile" });
          }}>
          Sign in via Twitter
        </Button>
      </div>
    </>
  ) : (
    ""
  );
};
