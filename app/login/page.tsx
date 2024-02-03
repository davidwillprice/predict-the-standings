import { Panel } from "@components/panels/panel";
import { LoginForm } from "@components/login/login-form";
import { PanelHeading } from "@components/panels/panel-heading";

const Page = () => {
  /**@todo Redirect from page if signed in*/
  /**@todo Fix Reddit issue on PTS.com `An error occurred in the Server Components render. The specific message is omitted in production builds to avoid leaking sensitive details. A digest property is included on this error instance which may provide additional details about the nature of the error. Digest: 725504142`*/
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
