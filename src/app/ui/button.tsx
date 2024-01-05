import { ReactNode } from "react";

import styles from "./styles/button.module.scss";

interface Props {
  children: ReactNode;
}

export const Button = ({ children }: Props) => (
  <button className={styles.button}>{children}</button>
);
