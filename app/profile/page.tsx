import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { SignOutBtn } from "@components/profile/sign-out";
import { ProfileForm } from "@components/form/profile-form";
import { PerformanceOverview } from "@components/profile/performance-overview";
import { DeleteAccount } from "@components/profile/delete-account";

import commonStyles from "@styles/common.module.scss";
import btnConStyles from "@components/button/button-containers.module.scss";

export const metadata: Metadata = {
  title: "Profile | Predict The Standings",
};

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (user == null) return redirect("/login");
  /**@todo! Fix redirecting people without a display name causing issues */
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
        <div className={btnConStyles.doubleCol}>
          <SignOutBtn />
          <DeleteAccount user={user} />
        </div>
      </Panel>
      <PerformanceOverview user={user} />
    </>
  );
}
