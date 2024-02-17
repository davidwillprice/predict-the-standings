import { ReactNode, useState } from "react";

import Icon from "@svgs/icons/sq-icon";

import styles from "@components/dropdown/dropdown.module.scss";

interface Props {
  label: string;
  children: ReactNode;
}

export const Dropdown = ({ children, label }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div
      aria-expanded={open}
      className={`${styles.dropdown} ${open ? styles.open : ""}`}>
      <button onClick={handleOpen} className={styles.btn}>
        <div className={styles.label}>
          <div className={styles.icon}>
            <Icon type="accessibility" strokeWidth={2} />
          </div>
          {label}
        </div>
        <i />
      </button>
      {open ? <div className={styles.options}>{children}</div> : ""}
    </div>
  );
};
