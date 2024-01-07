import { ReactNode } from "react";

import styles from "./styles/button.module.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, ...rest }: Props) => (
  <button {...rest} className={styles.button}>
    {children}
  </button>
);
