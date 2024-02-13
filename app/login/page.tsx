import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { LoginForm } from "@components/login/login-form";
import { PanelHeading } from "@components/panels/panel-heading";

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session !== null) {
    if (session?.user.displayName === null) {
      return redirect("/get-started");
    } else {
      {
        /**@todo Update redirect to a more general location where they can see multiple sports */
      }
      return redirect("/formula-1/");
    }
  }
  return (
    <>
      <PanelHeading>
        <h1>Login</h1>
      </PanelHeading>
      <Panel>
        <LoginForm />
      </Panel>
    </>
  );
};

export default Page;
