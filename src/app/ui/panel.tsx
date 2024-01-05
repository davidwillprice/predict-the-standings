import { ReactNode } from "react";
import styles from "../ui/styles/panel.module.scss";
interface Props {
  children: string | ReactNode;
}

export const Panel = ({ children }: Props) => {
  return <div className={styles.panel}>{children}</div>;
};
