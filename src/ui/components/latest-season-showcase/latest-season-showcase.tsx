import { ReactNode } from "react";
import Link from "next/link";

import { Countdown } from "@components/countdown/countdown";
import Icon from "@svgs/icons/sq-icon";

import styles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

import { LocalSeasonData } from "@custom-types/game-types";
import { CompetitionLink } from "@custom-types/misc";

interface Props {
  children: ReactNode;
  localSeasonData: LocalSeasonData;
  linkArr: CompetitionLink[];
}

/**If the predictions aren't open, say when they will be. If they are open, prompt people to edit and submit their predictions. If the predictions are frozen, hide this component entirely */
export const LatestSeasonShowcase = ({
  children,
  linkArr,
  localSeasonData,
}: Props) => {
  const {
    arePredictionsFrozen,
    competition,
    id: seasonStr,
    predictionFreezeTime,
    predictionsOpen,
    rounds,
  } = localSeasonData;
  const competitionDir = competition === "f1" ? "formula-1" : competition;
  /**@todo Add additional data like how many rounds have been completed, or how many people have submitted predictions */
  return (
    <>
      {!predictionsOpen ? (
        <p>Predictions will open once the entrants are confirmed.</p>
      ) : (
        !arePredictionsFrozen && (
          <>
            {children}
            <Countdown deadline={predictionFreezeTime} />
            <div className={styles.single}>
              <Link
                href={`/${competitionDir}/${seasonStr}/predict`}
                className={btnStyles.button}>
                <Icon strokeWidth={2} type="listBullet" />
                Predict The Standings
              </Link>
            </div>
            <hr />
          </>
        )
      )}
      <div className={styles.doubleCol}>
        {rounds.length > 0 &&
          linkArr.map((link) => (
            <Link
              key={link.icon}
              href={`/${competitionDir}/${seasonStr}/${link.href}`}
              className={btnStyles.button}>
              <Icon strokeWidth={2} type={link.icon} />
              {link.text}
            </Link>
          ))}
        <Link href="/help" className={btnStyles.button}>
          <Icon strokeWidth={2} type="help" />
          Help
        </Link>
      </div>
    </>
  );
};
