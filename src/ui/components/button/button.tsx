import { ReactNode } from "react";

import styles from "@components/button/button.module.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  smallIcon?: boolean;
}

export const Button = ({ children, className, smallIcon, ...rest }: Props) => (
  <button
    {...rest}
    className={`${styles.button} ${smallIcon ? styles.smallIcon : ""} ${
      className ? className : ""
    }`}>
    {children}
  </button>
);
