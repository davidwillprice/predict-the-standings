import { ReactNode } from "react";
import styles from "@components/panels/panel-heading.module.scss";
import { HeadingSplitter } from "@components/heading-splitter";

interface Props {
  children?: string | ReactNode;
  align?: "left" | "center";
  mainHeading?: string;
  secondaryHeading?: string;
}

export const PanelHeading = ({
  align = "left",
  children,
  mainHeading,
  secondaryHeading,
}: Props) => (
  <div
    className={`${styles.panel_heading} ${
      align === "center" ? styles.center : ""
    }`}>
    {children ? (
      children
    ) : (
      <h1>
        {mainHeading}
        <HeadingSplitter />
        <span className={styles.secondaryHeading}>{secondaryHeading}</span>
      </h1>
    )}
  </div>
);
