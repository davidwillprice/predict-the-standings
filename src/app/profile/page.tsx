"use client";

import { useSession, signOut } from "next-auth/react";

import { Button } from "@ui/button";
import { Panel } from "@ui/panel";
import { PanelHeading } from "@ui/panel-heading";

import styles from "@ui/styles/account.module.scss";

export default function ProfilePage() {
  const { data: session } = useSession();
  const name = session?.user?.name as string;
  const email = session?.user?.email;
  return (
    <>
      <PanelHeading>
        <h2>Account</h2>
      </PanelHeading>
      <Panel>
        <div className={styles.account}>
          <div className={styles.input_container}>
            <label htmlFor="name">Display Name</label>
            <input id="name" type="name" name="name" value={name} />
          </div>
          {email ? (
            <div className={styles.input_container}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={session?.user?.email as string}
                disabled
              />
            </div>
          ) : (
            ""
          )}
          <hr />
          <div>
            <Button
              onClick={async () => {
                await signOut({ callbackUrl: "/" });
              }}>
              Sign Out
            </Button>
          </div>
        </div>
      </Panel>
    </>
  );
}
