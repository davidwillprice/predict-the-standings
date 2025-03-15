"use client";
import { useSearchParams } from "next/navigation";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import Link from "next/link";
import Icon from "@ui/svgs/icons/sq-icon";

import btnStyles from "@components/button/button.module.scss";
import styles from "@components/login/login.module.scss";

export default function Page() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMsg =
    error == "Configuration"
      ? " configuration"
      : error == "AccessDenied"
      ? " 'Access Denied'"
      : error == "Verification"
      ? " verification"
      : "";
  return (
    <>
      <PanelHeading>
        <h2>Something went wrong!</h2>
      </PanelHeading>
      <Panel>
        <section>
          <p>
            {`Unfortunately there was an${
              errorMsg ? errorMsg : ""
            } error when you tried to sign in, please
            try again.`}
          </p>
          <div className={styles.btn_con}>
            <Link href={"/login"} className={btnStyles.button}>
              <Icon strokeWidth={2} type="login" />
              Login
            </Link>
          </div>
        </section>
      </Panel>
    </>
  );
}
