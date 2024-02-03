import { ReactNode } from "react";
import styles from "@components/panels/panel-heading.module.scss";
interface Props {
  children: string | ReactNode;
  align?: "left" | "center";
}

export const PanelHeading = ({ align = "left", children }: Props) => (
  <div
    className={`${styles.panel_heading} ${
      align === "center" ? styles.center : ""
    }`}>
    {children}
  </div>
);
