import Link from "next/link";
import { Metadata, NextPage } from "next";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { PredictionPromptCompetitionHp } from "@components/prediction-prompt-comp-hp/prediction-prompt-comp-hp";
import Icon from "@svgs/icons/sq-icon";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import styles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

export const metadata: Metadata = {
  title: "Predict The Eurovision Standings",
};

const Page: NextPage = async () => {
  const latestSeason = "2024";
  const competition = "eurovision";
  const { predictionFreezeTime, predictionsOpen } =
    allEurovisionSeasonData[latestSeason];
  return (
    <>
      <PanelHeading>
        <h1>Predict The Eurovision Grand Final Standings</h1>
      </PanelHeading>
      <Panel>
        {/**@todo Add text for after the season has started */}
        <p>
          Compete against people around the world to predict the Eurovision
          Grand Final results.
        </p>
        <ul>
          <li>
            The leaderboards will be updated after the results are announced.
          </li>
          <li>
            View stats and trivia on how controversial your each of predictions
            are, and how accurately players have predicted each country&apos;
            standing.
          </li>
        </ul>
        <PredictionPromptCompetitionHp
          competition={competition}
          latestSeason={latestSeason}
          predictionFreezeTime={predictionFreezeTime}
          predictionsOpen={predictionsOpen}>
          <p>
            You have until the voting results start being announced to submit
            (and edit) your predictions.
          </p>
        </PredictionPromptCompetitionHp>
        <hr />
        <div className={styles.quadruple}>
          <Link
            href={`/${competition}/${latestSeason}`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="microphone" />
            Leaderboard
          </Link>
          <Link
            href={`/${competition}/${latestSeason}/stats/country`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="stats" />
            Country Stats
          </Link>
          <Link
            href={`/${competition}/${latestSeason}/stats/player`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="group" />
            Player Stats
          </Link>
          <Link href="/help" className={btnStyles.button}>
            <Icon strokeWidth={2} type="help" />
            Help
          </Link>
        </div>
        <hr />
        <p>
          <small>
            This website is unofficial and is not associated in any way with
            Eurovision. Eurovision is a registered trademark of the EBU.
          </small>
        </p>
      </Panel>
    </>
  );
};

export default Page;
