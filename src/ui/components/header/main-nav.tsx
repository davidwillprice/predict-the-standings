"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

import Icon from "@svgs/icons/sq-icon";
import HeaderLink from "@components/header/header-link";

import styles from "@components/header/header.module.scss";
import commonStyles from "@styles/common.module.scss";

interface Props {
  children: ReactNode;
}

export const MainNav = ({ children }: Props) => {
  const pathname = usePathname();

  const [mobMenuOpen, toggleMobMenu] = useState(false);

  const handleMobMenuCick = () => {
    toggleMobMenu(!mobMenuOpen);
  };
  useEffect(() => {
    /** Whenever the page changes, the mobile menu is closed*/
    toggleMobMenu(false);
  }, [pathname]);

  const predictionLinks = pathname.startsWith("/formula-1") ? (
    <>
      {/**@todo Add year selector*/}
      {/**@todo Add 'Edit Predictions' or 'Predict' depending on if the predictions are open and they are logged in*/}
      <HeaderLink href="/formula-1/2024" icon="group">
        Leaderboards
      </HeaderLink>
      {/**@todo Only shows if user has made predictions for the year
      <HeaderLink href="/formula-1/2024/table" icon="f1">
        Your Prediction Table
      </HeaderLink>*/}
      <HeaderLink href="/formula-1/2024/stats" icon="stats">
        Stats & Trivia
      </HeaderLink>
    </>
  ) : (
    <>
      <HeaderLink href="/formula-1" icon="f1">
        Formula 1
      </HeaderLink>
      <HeaderLink href="/premier-league" icon="premierLeague">
        Premier League
      </HeaderLink>
    </>
  );

  return (
    <>
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
        <div>{children}</div>
        <hr />
        <div>{predictionLinks}</div>
        <hr />
        <div>
          <HeaderLink href="/help" icon="help">
            Help
          </HeaderLink>
          {/* {<div className={styles.dropdown}>
            <div className={styles.dropdown__label}>
              <div className={styles.icon}>
                <Icon type="accessibility" strokeWidth={2} />
              </div>
              Accessbility
            </div>
            <i />
          </div>} */}
        </div>
      </nav>
    </>
  );
};
