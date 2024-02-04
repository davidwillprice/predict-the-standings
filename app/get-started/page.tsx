import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { GetStartedForm } from "@components/form/get-started";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/login");
  }

  const name = session?.user?.name as string;
  const email = session?.user?.email;

  /**If the Next Auth gave an email address, use the first part of that as a suggested display name. Else use the user's name as Reddit provides their Reddit username there */
  const initialDisplayName = email ? email.slice(0, email.indexOf("@")) : name;

  return (
    <>
      <PanelHeading>
        <h2>Get Started</h2>
      </PanelHeading>
      <Panel>
        <p>
          Before you submit any predictions, please choose a display name which
          will appear publically next to your predictions on the leaderboard.
        </p>
        <GetStartedForm initialDisplayName={initialDisplayName} />
        {/**@todo Once they've submitted a value display name, show links to currently running competitions, other have a message of something like 'Come back soon' */}
      </Panel>
    </>
  );
}
