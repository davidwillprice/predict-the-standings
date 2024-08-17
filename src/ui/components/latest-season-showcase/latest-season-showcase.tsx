import { ReactNode } from "react";
import Link from "next/link";

import { Countdown } from "@components/countdown/countdown";
import Icon from "@svgs/icons/sq-icon";
import { CompetitionNavLinks } from "./comp-nav-links";

import styles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

import { LocalSeasonData } from "@custom-types/game-types";
import { CompetitionLink } from "@custom-types/misc";

interface Props {
  children: ReactNode;
  localSeasonData: LocalSeasonData;
  linkArr: CompetitionLink[];
  postFreezePreRoundText?: string;
  showHelp?: boolean;
}

/**If the predictions aren't open, say when they will be. If they are open, prompt people to edit and submit their predictions. If predictions are frozen but round data hasn't been posted yet, let people know when the leaderboard will be available. If there is round data, show the links to stats and the leaderboard */
export const LatestSeasonShowcase = ({
  children,
  linkArr,
  localSeasonData,
  postFreezePreRoundText,
  showHelp = true,
}: Props) => {
  const {
    arePredictionsFrozen,
    competitionStrs,
    id: seasonStr,
    predictionFreezeDate,
    predictionsOpen,
    rounds,
  } = localSeasonData;
  /**@todo Add additional data like how many rounds have been completed, or how many people have submitted predictions */

  let content;

  if (!predictionsOpen) {
    content = <p>Predictions will open once the entrants are confirmed.</p>;
  } else if (!arePredictionsFrozen) {
    content = (
      <>
        {children}
        {
          /**Hide the countdown for Eurovision as it doesn't have a set time when the voting will start being annouced */
          competitionStrs.shortHand !== "eurovision" && (
            <Countdown deadline={predictionFreezeDate} />
          )
        }
        <div className={styles.single}>
          <Link
            href={`/${competitionStrs.hyphenated}/${seasonStr}/predict`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="listBullet" />
            Predict The Standings
          </Link>
        </div>
        {localSeasonData.rounds.length > 0 || showHelp ? <hr /> : ""}
      </>
    );
  } else if (rounds.length === 0 && postFreezePreRoundText) {
    content = <p>{postFreezePreRoundText}</p>;
  }

  return (
    <>
      {content}
      <CompetitionNavLinks
        linkArr={linkArr}
        localSeasonData={localSeasonData}
        showHelp={showHelp}
      />
    </>
  );
};
