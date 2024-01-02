"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import commonStyles from "./styles/common.module.scss";
import styles from "./styles/header.module.scss";

import Icon from "./svgs/icons/sq-icon";

const Header = () => {
  const [mobMenuOpen, toggleMobMenu] = useState(false);

  const pathname = usePathname();

  const handleMobMenuCick = () => {
    toggleMobMenu(!mobMenuOpen);
  };

  useEffect(() => {
    /**
     * Whenever the page changes, the mobile menu is closed
     */
    toggleMobMenu(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.pinned_header}>
        <div className={styles.logo}>
          <Link href="/" className={styles.link}>
            <div className={styles.icon}>
              <Icon type="trophy" strokeWidth={2} />
            </div>
            Predict The Standings
          </Link>
        </div>
        <button
          className={`${styles.menu_button} ${
            mobMenuOpen ? styles.menu_open : ""
          }`}
          onClick={handleMobMenuCick}
          aria-label="Mobile menu">
          <span className={styles.menu_button__line} />
          <span className={styles.menu_button__line} />
          <span className={styles.menu_button__line} />
          <span className={styles.menu_button__line} />
        </button>
      </div>
      <nav
        className={`${styles.primary_menu} ${
          mobMenuOpen ? "" : commonStyles.mobile_hide
        }`}>
        <hr />
        <div>
          <Link href="/profile" className={styles.link}>
            <div className={styles.icon}>
              <Icon type="profile" strokeWidth={2} />
            </div>
            Profile
          </Link>
        </div>
        <hr />
        <div>
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
        </div>
        <hr />
        <div>
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
        </div>
      </nav>
      <nav className={styles.secondary_menu}>
        <hr />
        <div>Privacy Policy</div>
      </nav>
    </header>
  );
};
export default Header;
