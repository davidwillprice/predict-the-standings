import { Panel } from "../../src/ui/panel";
import { LoginForm } from "../../src/ui/login-form";
import { PanelHeading } from "../../src/ui/panel-heading";

const Page = () => {
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
