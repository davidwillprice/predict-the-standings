import React, { ReactNode } from "react";
import styles from "@components/modal/modal.module.scss";

interface Props {
  children: ReactNode;
  heading: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<Props> = ({ children, heading, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{heading}</h3>
          <button className={styles.close} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.body}>
          {" "}
          <hr />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
