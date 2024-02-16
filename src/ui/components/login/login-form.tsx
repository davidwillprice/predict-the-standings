"use client";

import { signIn } from "next-auth/react";

import { Button } from "@components/button/button";

import styles from "@components/login/login.module.scss";

export const LoginForm = () => (
  <>
    <div className={styles.login}>
      {/**@todo Add icons for each login */}
      {/**@todo Add loading spinner */}
      {/**Instagram provider seems to require a verified FB business account
       * Apple developer program costs $99py so can't add Apple provider*/}
      {/**@todo Add Linkedin (requires LinkedIn Page) login */}
      {/**@todo Fix Patreon & Spotify logins */}
      <div className={styles.btn_con}>
        <Button
          onClick={async () => {
            await signIn("discord", { redirect: false });
          }}>
          Sign in via Discord
        </Button>
        <Button
          onClick={async () => {
            await signIn("facebook", { redirect: false });
          }}>
          Sign in via Facebook
        </Button>
        <Button
          onClick={async () => {
            await signIn("github", { redirect: false });
          }}>
          Sign in via Github
        </Button>
        <Button
          onClick={async () => {
            await signIn("google", { redirect: false });
          }}>
          Sign in via Google
        </Button>
        {/** 
      <Button
        onClick={async () => {
          await signIn("patreon", { redirect: false });
        }}>
        Sign in via Patreon
      </Button>*/}
        <Button
          onClick={async () => {
            await signIn("reddit", { redirect: false });
          }}>
          Sign in via Reddit
        </Button>
        {/**
       <Button
        onClick={async () => {
          await signIn("spotify", { redirect: false });
        }}>
        Sign in via Spotify
      </Button>*/}
        <Button
          onClick={async () => {
            await signIn("twitter", { redirect: false });
          }}>
          Sign in via Twitter
        </Button>
      </div>
    </div>
  </>
);
