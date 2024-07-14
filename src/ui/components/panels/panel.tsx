import { ReactNode } from "react";
import styles from "@components/panels/panel.module.scss";
interface Props {
  children: string | ReactNode;
  className?: string;
}

export const Panel = ({ children, className }: Props) => {
  return (
    <div className={`${styles.panel} ${className}`}>
      <div className={styles.panelBody}>{children}</div>
    </div>
  );
};
