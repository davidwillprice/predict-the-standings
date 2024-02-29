import Link from "next/link";
import { Metadata } from "next";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { Button } from "@components/button/button";
import Icon from "@svgs/icons/sq-icon";
import { Countdown } from "@components/countdown/countdown";

import { allSeasonData } from "@data/formula-1/season-data";

import styles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

export const metadata: Metadata = {
  title: "Predict The Formula 1 Standings",
};

const Page = () => {
  const { predictionFreezeTime } = allSeasonData["2024"];
  return (
    <>
      <PanelHeading>
        <h1>Predict The Formula 1 Standings</h1>
      </PanelHeading>
      <Panel>
        {/**@todo Add text for after the season has started */}
        <p>
          Compete against people around the world to predict the driver and
          constructor standings for the 2024 F1 Season.
        </p>
        <ul>
          <li>
            The leaderboards will be updated after each round so you can see how
            your predictions are performing throughout the season.
          </li>
          <li>
            View stats and trivia on how controversial your each of predictions
            are, and how accurately players have predicted each driver&apos;s
            and constructor&apos;s standing.
          </li>
        </ul>
        {predictionFreezeTime.getTime() > new Date().getTime() ? (
          <>
            <p>
              You have until the start of opening weekend&apos;s Free Practice 1
              to submit (and edit) your predictions.
            </p>
            <div className={styles.single}>
              <Link href="/formula-1/predict" className={btnStyles.button}>
                <Icon strokeWidth={2} type="listBullet" />
                Predict The Standings
              </Link>
            </div>
            <Countdown deadline={predictionFreezeTime} />
          </>
        ) : (
          ""
        )}
        <hr />
        <div className={styles.quadruple}>
          <Link href="/formula-1/2024" className={btnStyles.button}>
            <Icon strokeWidth={2} type="driver" />
            Drivers Leaderboard
          </Link>
          <Link
            href="/formula-1/2024/?leaderboard=constructors"
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="f1" />
            Constructors Leaderboard
          </Link>
          <Link
            href="/formula-1/2024/stats/driver-and-team"
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="stats" />
            Stats
          </Link>
          <Link href="/help" className={btnStyles.button}>
            <Icon strokeWidth={2} type="help" />
            Help
          </Link>
        </div>
        <hr />
        <p>
          <small>
            This website is unofficial and is not associated in any way with the
            Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE
            WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of
            Formula One Licensing B.V.
          </small>
        </p>
      </Panel>
    </>
  );
};

export default Page;
