import styles from "./scroll-prompt.module.scss";

export const ScrollPrompt = () => (
  <>
    <div className={styles.outer_con}>
      <div className={styles.inner_con}>
        <div className={`${styles.arrow} ${styles.arrow_first}`}></div>
        <div className={`${styles.arrow} ${styles.arrow_second}`}></div>
      </div>
    </div>
  </>
);
