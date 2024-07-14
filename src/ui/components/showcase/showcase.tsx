interface Props {
  children: React.ReactNode;
  className?: string;
}

import styles from "./showcase.module.scss";

export const Showcase = ({ className, children }: Props) => (
  <div className={`${styles.showcase} ${className}`}>
    <div className={styles.ui}>
      <div className={styles.ui__btn}></div>
      <div className={styles.ui__btn}></div>
      <div className={styles.ui__btn}></div>
    </div>
    {children}
  </div>
);
