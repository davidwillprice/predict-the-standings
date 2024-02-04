import Icon from "@ui/svgs/icons/sq-icon";

import styles from "./feedback-container.module.scss";

interface Props {
  iconType: "success" | "error";
  children: React.ReactNode;
}

export const FeedbackContainer = ({ children, iconType }: Props) => (
  <div
    className={`${iconType === "error" ? styles.error : styles.success} ${
      styles.feedback
    }`}>
    <div className={styles.icon}>
      <Icon type={iconType} strokeWidth={2} />
    </div>
    {children}
  </div>
);
