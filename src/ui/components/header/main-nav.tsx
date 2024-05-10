"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import { Session } from "next-auth";

import { allF1SeasonData } from "@data/formula-1/season-data";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import Icon from "@svgs/icons/sq-icon";
import HeaderLink from "@components/header/header-link";
import { AccessibilityOptions } from "@components/accessibility/accessibility";
import { Dropdown } from "@components/dropdown/dropdown";
import { EurovisionNav } from "@components/header/competition-nav/eurovision-nav";
import { Formula1Nav } from "./competition-nav/formula-1-nav";

import styles from "@components/header/header.module.scss";
import commonStyles from "@styles/common.module.scss";

interface Props {
  children: ReactNode;
  session: Session | null;
}

export const MainNav = ({ children, session }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobMenuOpen, toggleMobMenu] = useState(false);

  {
    /**@todo Make mobile menu close if content outside of it is tapped */
  }
  const handleMobMenuCick = () => {
    toggleMobMenu(!mobMenuOpen);
  };
  useEffect(() => {
    /** Whenever the page changes, the mobile menu is closed*/
    toggleMobMenu(false);
  }, [pathname, searchParams]);

  const latestF1Season = allF1SeasonData[0];

  const latestEurovisionSeason = allEurovisionSeasonData[0];

  const predictionLinks = pathname.startsWith("/formula-1") ? (
    <Formula1Nav seasonData={latestF1Season} />
  ) : pathname.startsWith("/eurovision") ? (
    <EurovisionNav
      competition={"eurovision"}
      seasonData={latestEurovisionSeason}
      session={session}
    />
  ) : (
    <>
      <HeaderLink href="/eurovision" icon="microphone">
        Eurovision
      </HeaderLink>
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
          <Dropdown label="Accessibility">
            <AccessibilityOptions />
          </Dropdown>
        </div>
      </nav>
    </>
  );
};
