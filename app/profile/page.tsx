import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import { authOptions } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { SignOutBtn } from "@components/profile/sign-out";

import styles from "@components/form/form.module.scss";

export const metadata: Metadata = {
  title: "Profile | Predict The Standings",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/login");
  } else if (session?.user.displayName === null) {
    return redirect("/get-started");
  }

  const displayName = session?.user.displayName;
  const email = session?.user?.email;
  return (
    <>
      <PanelHeading>
        <h2>Account</h2>
      </PanelHeading>
      <Panel>
        <form className={styles.form}>
          {/**@todo Add ability to change display name, but limit changes to once a day or something to save DB calls */}
          <div className={styles.input_container}>
            <label htmlFor="name">Display Name</label>
            <input
              id="name"
              type="name"
              name="name"
              value={displayName}
              disabled
            />
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
        </form>
        <hr />
        <div className={styles.formBtns}>
          <SignOutBtn />
        </div>
      </Panel>
    </>
  );
}
