import { ReactNode } from "react";
import styles from "@components/panels/panel.module.scss";
interface Props {
  children: string | ReactNode;
}

export const Panel = ({ children }: Props) => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelBody}>{children}</div>
    </div>
  );
};
