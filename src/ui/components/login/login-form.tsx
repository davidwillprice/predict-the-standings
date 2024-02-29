"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@components/button/button";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

import styles from "@components/login/login.module.scss";
import Icon from "@ui/svgs/icons/sq-icon";

export const LoginForm = () => {
  const [submitting, isSubmitting] = useState(false);

  const signInHandler = async (e: React.MouseEvent<HTMLElement>) => {
    isSubmitting(true);
    await signIn(e.currentTarget.id, { redirect: false });
  };

  return (
    <>
      <div className={`${styles.login} ${submitting ? styles.loading : ""}`}>
        {/**Instagram/FB provider seems to require a verified FB business account
         * Apple developer program costs $99py so can't add Apple provider*/}
        {/**@todo Add Linkedin (requires LinkedIn Page) login */}
        {/**@todo Fix Patreon & Spotify logins */}
        {/**@todo If there is a login redirect query, redirect the user to the page they couldn't previously access */}
        {submitting ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.btn_con}>
            <Button
              id="discord"
              className={styles.discord}
              onClick={signInHandler}>
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
              id="github"
              className={styles.github}
              onClick={signInHandler}>
              <Icon strokeWidth={2} type="github" />
              Sign in via Github
            </Button>
            <Button
              id="google"
              className={styles.google}
              onClick={signInHandler}>
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
              id="reddit"
              className={styles.reddit}
              onClick={signInHandler}>
              <Icon strokeWidth={2} type="reddit" />
              Sign in via Reddit
            </Button>
            {/* <Button
              onClick={async () => {
                await signIn("spotify", { redirect: false });
              }}>
              Sign in via Spotify
            </Button> */}
            <Button
              id="twitter"
              className={styles.twitter}
              onClick={signInHandler}>
              <Icon strokeWidth={2} type="twitter" />
              Sign in via Twitter
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
