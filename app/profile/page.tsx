import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@lib/auth";
import { SessionProvider } from "next-auth/react";

import { PanelHeading } from "@components/panels/panel-heading";
import { ProfileContainer } from "@components/profile/profile-container";

export const metadata: Metadata = {
  title: "Profile | Predict The Standings",
};

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (user == null) return redirect("/login");

  return (
    <SessionProvider session={session}>
      <PanelHeading>
        <h2>Account</h2>
      </PanelHeading>
      <ProfileContainer />
    </SessionProvider>
  );
}
