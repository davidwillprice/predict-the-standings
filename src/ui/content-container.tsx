import { ReactNode } from "react";

import styles from "@styles/content-container.module.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const ContentContainer = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);
