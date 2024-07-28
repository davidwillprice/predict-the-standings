import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@lib/auth";
import { SessionProvider } from "next-auth/react";
import { generateOgImgUrl } from "@lib/misc";

import { PanelHeading } from "@components/panels/panel-heading";
import { ProfileContainer } from "@components/profile/profile-container";

export const metadata: Metadata = {
  title: "Profile | Predict The Standings",
  description:
    "Sign out, delete your account, change your display name, or view all your predictions",
  openGraph: {
    images: [
      {
        url: generateOgImgUrl("Profile", "profile"),
        alt: "Page screenshot",
      },
    ],
  },
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
