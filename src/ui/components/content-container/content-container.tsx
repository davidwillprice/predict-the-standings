import { ReactNode } from "react";

import styles from "@components/content-container/content-container.module.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const ContentContainer = ({ children }: Props) => (
  <div className={styles.container}>{children}</div>
);
