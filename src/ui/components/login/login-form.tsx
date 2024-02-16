"use client";

import { signIn } from "next-auth/react";

import { Button } from "@components/button/button";

import styles from "@components/login/login.module.scss";
import Icon from "@ui/svgs/icons/sq-icon";

export const LoginForm = () => (
  <>
    <div className={styles.login}>
      {/**@todo Add icons for each login */}
      {/**@todo Add loading spinner */}
      {/**Instagram/FB provider seems to require a verified FB business account
       * Apple developer program costs $99py so can't add Apple provider*/}
      {/**@todo Add Linkedin (requires LinkedIn Page) login */}
      {/**@todo Fix Patreon & Spotify logins */}
      <div className={styles.btn_con}>
        <Button
          className={styles.discord}
          onClick={async () => {
            await signIn("discord", { redirect: false });
          }}>
          <Icon strokeWidth={2} type="discord" />
          Sign in via Discord
        </Button>
        {/** 
        <Button
          onClick={async () => {
            await signIn("facebook", { redirect: false });
          }}>
          Sign in via Facebook
        </Button>*/}
        <Button
          className={styles.github}
          onClick={async () => {
            await signIn("github", { redirect: false });
          }}>
          <Icon strokeWidth={2} type="github" />
          Sign in via Github
        </Button>
        <Button
          className={styles.google}
          onClick={async () => {
            await signIn("google", { redirect: false });
          }}>
          <Icon strokeWidth={2} type="google" />
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
          className={styles.reddit}
          onClick={async () => {
            await signIn("reddit", { redirect: false });
          }}>
          <Icon strokeWidth={2} type="reddit" />
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
          className={styles.twitter}
          onClick={async () => {
            await signIn("twitter", { redirect: false });
          }}>
          <Icon strokeWidth={2} type="twitter" />
          Sign in via Twitter
        </Button>
      </div>
    </div>
  </>
);
