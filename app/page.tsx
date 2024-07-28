import Image from "next/image";
import { Metadata } from "next";

import { generateOgImgUrl } from "@lib/misc";

import { PanelHeading } from "@components/panels/panel-heading";
import { Panel } from "@components/panels/panel";
import { CompetitionButtons } from "@components/competition-buttons";
import { Showcase } from "@components/showcase/showcase";

import leaderboardDesktopImg from "../src/images/pl2023_leaderboard_desktop_light.png";
import leaderboardMobileImg from "../src/images/pl2023_leaderboard_mobile_light.png";
import submitMobileImg from "../src/images/pl2024_predict_mobile_light.png";
import submitDesktopImg from "../src/images/pl2024_predict_desktop_light.png";
import userStatsMobileImg from "../src/images/pl2023_user-stats_mobile_light.png";
import userStatsDesktopImg from "../src/images/pl2023_user-stats_desktop_light.png";
import entrantStatsMobileImg from "../src/images/pl2023_team-stats_mobile_light.png";
import entrantStatsDesktopImg from "../src/images/pl2023_team-stats_desktop_light.png";
import loginMobileImg from "../src/images/login_mobile_light.png";
import loginDesktopImg from "../src/images/login_desktop_light.png";

import styles from "@styles/home.module.scss";
import commonStyles from "@styles/common.module.scss";
import { ScrollPrompt } from "@components/scroll-prompt/scroll-prompt";

export const metadata: Metadata = {
  title: "Predict The Standings",
  description:
    "Compete to predict the final tables for various sports and competitions",
  openGraph: {
    images: [
      {
        url: generateOgImgUrl(),
        alt: "Page screenshot",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.hero__text}>
          <PanelHeading>
            <h1>Predict The Standings</h1>
          </PanelHeading>
          <Panel>
            <p>
              Compete against people around the world to Predict The Standings
              for various sports and competitions.
            </p>
            <CompetitionButtons />
          </Panel>
          <Panel
            className={`${styles.feature__panel} ${styles.feature__panel__full_width}`}>
            <h3>Global Leaderboard</h3>
            <p>
              The leaderboard updates after every round so you can see how your
              predictions are performing throughout the season.
            </p>
          </Panel>
        </div>
        <Image
          draggable="false"
          className={styles.hero__image}
          src={leaderboardDesktopImg}
          width={2000}
          height={1230}
          alt={"Screenshot of a PTS leaderboard on a laptop"}
          quality={90}
        />
        <Showcase className={styles.leaderboard_image}>
          <Image
            draggable="false"
            src={leaderboardMobileImg}
            width={740}
            height={764}
            alt={"Screenshot of a PTS leaderboard on mobile"}
            quality={90}
          />
        </Showcase>
        <ScrollPrompt />
      </div>
      <div className={`${styles.feature} ${styles.feature__reverse_desktop}`}>
        <Panel className={styles.feature__panel}>
          <h3>Drag & Drop Submissions</h3>
          <p>
            Easily submit your predictions using a simple drag and drop system.
          </p>
        </Panel>
        <Showcase>
          <Image
            className={commonStyles.mobile_hide}
            draggable="false"
            src={submitDesktopImg}
            width={963}
            height={616}
            alt={"Screenshot of a PTS entrant submission page on desktop"}
            quality={90}
          />
          <Image
            className={commonStyles.mobile_show}
            draggable="false"
            src={submitMobileImg}
            width={628}
            height={619}
            alt={"Screenshot of a PTS entrant submission page on mobile"}
            quality={90}
          />
        </Showcase>
      </div>
      <div className={styles.feature}>
        <Panel className={styles.feature__panel}>
          <h3>Player Stats</h3>
          <p>
            View trivia including how controversial your predictions are and who
            topped the leaderboard for the longest period.
          </p>
        </Panel>
        <Showcase>
          <Image
            className={commonStyles.mobile_hide}
            draggable="false"
            src={userStatsDesktopImg}
            width={963}
            height={616}
            alt={"Screenshot of a PTS player stats page on desktop"}
            quality={90}
          />
          <Image
            className={commonStyles.mobile_show}
            draggable="false"
            src={userStatsMobileImg}
            width={628}
            height={619}
            alt={"Screenshot of a PTS player stats page on mobile"}
            quality={90}
          />
        </Showcase>
      </div>
      <div className={`${styles.feature} ${styles.feature__reverse_desktop}`}>
        <Panel className={styles.feature__panel}>
          <h3>Entrant Stats</h3>
          <p>
            View data on where people have predicted different entrants will
            finish, and which entrants have been the least and most accurate.
          </p>
        </Panel>
        <Showcase>
          <Image
            className={commonStyles.mobile_hide}
            draggable="false"
            src={entrantStatsDesktopImg}
            width={963}
            height={616}
            alt={"Screenshot of a PTS entrant stats page on desktop"}
            quality={90}
          />
          <Image
            className={commonStyles.mobile_show}
            draggable="false"
            src={entrantStatsMobileImg}
            width={628}
            height={619}
            alt={"Screenshot of a PTS entrant stats page on mobile"}
            quality={90}
          />
        </Showcase>
      </div>
      <div className={styles.feature}>
        <Panel className={styles.feature__panel}>
          <h3>Streamlined Login</h3>
          <p>
            One click login via a variety of OAuth services including Google,
            Reddit, Twitter, and Discord.
          </p>
        </Panel>
        <Showcase>
          <Image
            className={commonStyles.mobile_hide}
            draggable="false"
            src={loginDesktopImg}
            width={963}
            height={616}
            alt={"Screenshot of the PTS login page on desktop"}
            quality={90}
          />
          <Image
            className={commonStyles.mobile_show}
            draggable="false"
            src={loginMobileImg}
            width={628}
            height={619}
            alt={"Screenshot of the PTS login page on mobile"}
            quality={90}
          />
        </Showcase>
      </div>
    </div>
  );
}
