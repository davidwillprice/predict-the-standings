"use client";

import { useSession, signOut } from "next-auth/react";

import { Button } from "@components/button/button";
import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

import styles from "@styles/account.module.scss";

/**@todo Add ability to change display name, but limit changes to once a day or something to save DB calls */

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
