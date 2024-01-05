import { ReactNode } from "react";
import styles from "../ui/styles/panel-heading.module.scss";
interface Props {
  children: string | ReactNode;
}

export const PanelHeading = ({ children }: Props) => (
  <div className={styles.panel_heading}>{children}</div>
);
