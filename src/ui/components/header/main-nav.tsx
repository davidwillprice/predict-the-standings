"use client";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

import { allF1SeasonData } from "@data/formula-1/season-data";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import Icon from "@svgs/icons/sq-icon";
import HeaderLink from "@components/header/header-link";
import { AccessibilityOptions } from "@components/accessibility/accessibility";
import { Dropdown } from "@components/dropdown/dropdown";

import styles from "@components/header/header.module.scss";
import commonStyles from "@styles/common.module.scss";

interface Props {
  children: ReactNode;
}

export const MainNav = ({ children }: Props) => {
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

  const latestF1Season = "2024";
  const latestEurovisionSeason = "2024";
  const predictionF1FreezeTime =
    allF1SeasonData[latestF1Season].predictionFreezeTime;
  const predictionEurovisionFreezeTime =
    allEurovisionSeasonData[latestEurovisionSeason].predictionFreezeTime;
  const f1PredictionsOpen = allF1SeasonData[latestF1Season].predictionsOpen;
  const eurovisionPredictionsOpen =
    allEurovisionSeasonData[latestEurovisionSeason].predictionsOpen;

  /**@todo These competition specific sections should be refactored into different files*/

  const predictionLinks = pathname.startsWith("/formula-1") ? (
    <>
      {/**@todo Add year selector*/}
      {predictionF1FreezeTime.getTime() > new Date().getTime() &&
        f1PredictionsOpen && (
          <HeaderLink href="/formula-1/2024/predict" icon="listBullet">
            Submit Predictions
          </HeaderLink>
        )}
      <HeaderLink
        customLinkActiveOptions={{
          href: `/formula-1/${latestF1Season}`,
          includeQuery: false,
          query: ["leaderboard", "constructors"],
        }}
        href={`/formula-1/${latestF1Season}`}
        icon="driver">
        Drivers Leaderboard
      </HeaderLink>
      <HeaderLink
        customLinkActiveOptions={{
          href: `/formula-1/${latestF1Season}`,
          includeQuery: true,
          query: ["leaderboard", "constructors"],
        }}
        href={`/formula-1/${latestF1Season}/?leaderboard=constructors`}
        icon="f1">
        Constructors Leaderboard
      </HeaderLink>
      <HeaderLink
        href={`/formula-1/${latestF1Season}/stats/driver-and-team`}
        icon="stats">
        Driver & Team Stats
      </HeaderLink>
      <HeaderLink
        href={`/formula-1/${latestF1Season}/stats/player`}
        icon="group">
        Player Stats
      </HeaderLink>
    </>
  ) : pathname.startsWith("/eurovision") ? (
    <>
      {/**@todo Add year selector*/}
      {predictionEurovisionFreezeTime.getTime() > new Date().getTime() &&
        eurovisionPredictionsOpen && (
          <HeaderLink
            href={`/eurovision/${latestEurovisionSeason}/predict`}
            icon="listBullet">
            Submit Predictions
          </HeaderLink>
        )}
      <HeaderLink
        href={`/eurovision/${latestEurovisionSeason}`}
        icon="microphone">
        Leaderboard
      </HeaderLink>
      <HeaderLink
        href={`/eurovision/${latestEurovisionSeason}/stats/country`}
        icon="stats">
        Country Stats
      </HeaderLink>
      <HeaderLink
        href={`/eurovision/${latestEurovisionSeason}/stats/player`}
        icon="group">
        Player Stats
      </HeaderLink>
    </>
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
