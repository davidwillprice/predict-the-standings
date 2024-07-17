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
  showHelp?: boolean;
}

/**If the predictions aren't open, say when they will be. If they are open, prompt people to edit and submit their predictions. If the predictions are frozen, hide this component entirely */
export const LatestSeasonShowcase = ({
  children,
  linkArr,
  localSeasonData,
  showHelp = true,
}: Props) => {
  const {
    arePredictionsFrozen,
    competitionStrs,
    id: seasonStr,
    predictionFreezeDate,
    predictionsOpen,
  } = localSeasonData;
  /**@todo Add additional data like how many rounds have been completed, or how many people have submitted predictions */
  return (
    <>
      {!predictionsOpen ? (
        <p>Predictions will open once the entrants are confirmed.</p>
      ) : (
        !arePredictionsFrozen && (
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
        )
      )}
      <CompetitionNavLinks
        linkArr={linkArr}
        localSeasonData={localSeasonData}
        showHelp={showHelp}
      />
    </>
  );
};
