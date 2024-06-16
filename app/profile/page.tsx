import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { SignOutBtn } from "@components/profile/sign-out";
import { ProfileForm } from "@components/form/profile-form";
import { PerformanceOverview } from "@components/profile/performance-overview";
import { DeleteAccount } from "@components/profile/delete-account";
import { SetInitialDisplayNameForm } from "@components/form/set-initial-display-name-form";

import commonStyles from "@styles/common.module.scss";
import btnConStyles from "@components/button/button-containers.module.scss";
import formStyles from "@components/form/form.module.scss";

export const metadata: Metadata = {
  title: "Profile | Predict The Standings",
};

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (user == null) return redirect("/login");
  const email = user.email;

  const initialDisplayName = user.displayName
    ? user.displayName
    : email.slice(0, email.indexOf("@"));

  return (
    <>
      <PanelHeading>
        <h2>Account</h2>
      </PanelHeading>
      <Panel>
        {!user.displayName ? (
          /**If the user doesn't have a displayName, prompt them to set one*/
          <>
            <p>
              <strong>
                Before you submit any predictions, please choose a display name
                which will appear publicly next to your predictions on the
                leaderboard.
              </strong>
            </p>
            <p>Your display name must:</p>
            <ul className={formStyles.displayNameRules}>
              <li>Use a minimum of 3 characters.</li>
              <li>Use a maximum of 14 characters.</li>
              <li>Use a alphabetic character as the first character.</li>
              <li>Avoid highly offensive language.</li>
              <li>Only use alphanumeric characters and underscores.</li>
            </ul>
            <p>You can change your display name once a day.</p>
            <SetInitialDisplayNameForm
              initialDisplayName={initialDisplayName}
            />
          </>
        ) : (
          /**If the user has a displayName, allow them to update it*/
          <>
            <p className={commonStyles.text_center}>
              <small>You can change your display name once a day</small>
            </p>
            <ProfileForm initialDisplayName={initialDisplayName} />
          </>
        )}

        <hr />
        <div className={btnConStyles.doubleCol}>
          <SignOutBtn />
          <DeleteAccount user={user} />
        </div>
      </Panel>
      {user.displayName ? <PerformanceOverview user={user} /> : ""}
    </>
  );
}
