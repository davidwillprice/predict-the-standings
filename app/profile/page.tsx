import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Metadata } from "next";

import { authOptions } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { SignOutBtn } from "@components/profile/sign-out";
import { ProfileForm } from "@components/form/profile-form";

import styles from "@components/form/form.module.scss";
import commonStyles from "@styles/common.module.scss";

export const metadata: Metadata = {
  title: "Profile | Predict The Standings",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (session == null) return redirect("/login");
  //**Stopping redirecting people without a display name as it seems to be causing issues */
  //if (!session.user.displayName) return redirect("/get-started");

  const initialDisplayName = session?.user.displayName;

  return (
    <>
      <PanelHeading>
        <h2>Account</h2>
      </PanelHeading>
      <Panel>
        <p className={commonStyles.text_center}>
          <small>You can change your display name once a day</small>
        </p>
        <ProfileForm initialDisplayName={initialDisplayName} />
        <hr />
        <div className={styles.formBtns}>
          {/**@todo Add delete account button */}
          <SignOutBtn />
        </div>
      </Panel>
    </>
  );
}
