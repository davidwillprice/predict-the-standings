import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { LoginForm } from "@components/login/login-form";
import { PanelHeading } from "@components/panels/panel-heading";
import { FeedbackContainer } from "@components/feedback-container/feedback-container";

interface Props {
  searchParams: { [key: string]: string };
}

const Page = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);
  if (session !== null) {
    if (!session?.user.displayName) {
      return redirect("/get-started");
    } else {
      {
        /**@todo Update redirect to a more general location where they can see multiple sports */
      }
      return redirect("/formula-1/");
    }
  }
  const gatedPageError = searchParams["error"];
  return (
    <>
      <PanelHeading>
        <h1>Login</h1>
      </PanelHeading>
      {gatedPageError ? (
        <FeedbackContainer iconType="error">
          {gatedPageError === "display-name" ? (
            <p>Please login before you update your display name.</p>
          ) : (
            <p>Please login before you submit or edit predictions.</p>
          )}
        </FeedbackContainer>
      ) : (
        ""
      )}
      <Panel>
        <LoginForm />
        <div style={{ textAlign: "center" }}>
          <hr />
          <p>
            <Link href="/terms-of-service">Terms of Service</Link> |{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>
          </p>
        </div>
      </Panel>
    </>
  );
};

export default Page;
