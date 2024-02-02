import Icon from "@svgs/icons/sq-icon";

import styles from "@styles/loading-spinner.module.scss";

export const LoadingSpinner = () => (
  <div className={styles.con}>
    <Icon type={"loading"} strokeWidth={2} />
  </div>
);
