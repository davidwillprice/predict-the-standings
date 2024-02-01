"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import Icon from "@svgs/icons/sq-icon";
import HeaderLink from "./header-link";

import commonStyles from "@styles/common.module.scss";
import styles from "@styles/header.module.scss";

const Header = () => {
  const [mobMenuOpen, toggleMobMenu] = useState(false);

  const pathname = usePathname();

  const handleMobMenuCick = () => {
    toggleMobMenu(!mobMenuOpen);
  };

  const { data: session } = useSession();

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
          {!session?.user ? (
            <HeaderLink href="/login" icon="login">
              Login
            </HeaderLink>
          ) : (
            <HeaderLink href="/profile" icon="profile">
              Profile
            </HeaderLink>
          )}
        </div>
        <hr />
        <div>
          <HeaderLink href="/formula-1" icon="f1">
            Formula 1 Predictions
          </HeaderLink>
          <HeaderLink href="/premier-league" icon="premierLeague">
            Premier League Predictions
          </HeaderLink>
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
