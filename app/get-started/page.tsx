export const runtime = "edge";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GetStartedForm } from "@components/form/get-started";

import formStyles from "@components/form/form.module.scss";

export const metadata: Metadata = {
  title: "Get Started | Predict The Standings",
  description: "Choose your display name to get started",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/login?error=display-name");
  }

  const name = session.user.name as string;
  const email = session.user.email;
  const lastDisplayNameSubmissionDate: number | undefined =
    session.user.lastDisplayNameSubmissionDate;

  /**If the Next Auth gave an email address, use the first part of that as a suggested display name. Else use the user's name as Reddit provides their Reddit username there */
  /**@todo If they already have a display name, stop them trying to submit the same display name */
  const initialDisplayName = email
    ? email.slice(0, email.indexOf("@"))
    : name.replace(/ /g, "");

  return (
    <>
      <PanelHeading>
        <h2>Set Up Your Profile</h2>
      </PanelHeading>
      <Panel>
        <p>
          Before you submit any predictions, please choose a display name which
          will appear publicly next to your predictions on the leaderboard.
        </p>
        <p>Your display name must:</p>
        <ul className={formStyles.displayNameRules}>
          <li>Use a minimum of 3 characters.</li>
          <li>Use a maximum of 14 characters.</li>
          <li>Use a alphabetic character as the first character.</li>
          <li>Avoid highly offensive language.</li>
          <li>Only use alphanumeric characters and underscores.</li>
        </ul>
        <GetStartedForm
          initialDisplayName={initialDisplayName}
          lastDisplayNameSubmissionDate={lastDisplayNameSubmissionDate}
        />
      </Panel>
    </>
  );
}
