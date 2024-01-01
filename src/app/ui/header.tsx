import Link from "next/link";

import commonStyles from "./styles/common.module.scss";
import styles from "./styles/header.module.scss";

import Icon from "./svgs/icons/sq-icon";

const Header = () => (
  <header className={styles.header}>
    <div className={styles.pinned_header}>
      <div className={styles.logo}>
        <div className={styles.icon}>
          <Icon type="trophy" strokeWidth={2} />
        </div>
        Predict The Standings
      </div>
      <button className={styles.menu_button}>
        <span className={styles.menu_button__line} />
        <span className={styles.menu_button__line} />
        <span className={styles.menu_button__line} />
        <span className={styles.menu_button__line} />
      </button>
    </div>
    <nav className={`${commonStyles.mobile_hide} ${styles.primary_menu}`}>
      <hr className={commonStyles.mobile_hide} />
      <Link href="/profile" className={styles.link}>
        <div className={styles.icon}>
          <Icon type="profile" strokeWidth={2} />
        </div>
        Profile
      </Link>
      <hr />
      <Link href="/formula-1" className={styles.link}>
        <div className={styles.icon}>
          <Icon type="f1" strokeWidth={2} />
        </div>
        Formula 1 Predictions
      </Link>
      <Link href="/premier-league" className={styles.link}>
        <div className={styles.icon}>
          <Icon type="premierLeague" strokeWidth={2} />
        </div>
        Premier League Predictions
      </Link>
      <hr />
      <div className={styles.dropdown}>
        <div className={styles.dropdown__label}>
          <div className={styles.icon}>
            <Icon type="help" strokeWidth={2} />
          </div>
          Help
        </div>
        <i />
      </div>
      <div className={styles.dropdown}>
        <div className={styles.dropdown__label}>
          <div className={styles.icon}>
            <Icon type="accessibility" strokeWidth={2} />
          </div>
          Accessbility
        </div>
        <i />
      </div>
    </nav>
    <nav className={styles.secondary_menu}>
      <hr />
      <div>Privacy Policy</div>
    </nav>
  </header>
);
export default Header;
