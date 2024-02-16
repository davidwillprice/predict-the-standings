import { ReactNode } from "react";

import styles from "@components/button/button.module.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, ...rest }: Props) => (
  <button {...rest} className={`${styles.button} ${className}`}>
    {children}
  </button>
);
