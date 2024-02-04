import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { SignOutBtn } from "@components/profile/sign-out";

import styles from "@components/form/form.module.scss";

/**@todo Add ability to change display name, but limit changes to once a day or something to save DB calls */

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/login");
  }

  const name = session?.user?.name as string;
  const email = session?.user?.email;
  return (
    <>
      <PanelHeading>
        <h2>Account</h2>
      </PanelHeading>
      <Panel>
        <form className={styles.form}>
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
        </form>
        <hr />
        <div className={styles.formBtns}>
          <SignOutBtn />
        </div>
      </Panel>
    </>
  );
}
