import { Panel } from "../ui/panel";
import { LoginForm } from "../ui/login-form";
import { PanelHeading } from "../ui/panel-heading";

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
