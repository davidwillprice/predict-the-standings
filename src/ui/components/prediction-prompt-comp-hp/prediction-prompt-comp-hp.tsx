import { ReactNode } from "react";
import Link from "next/link";

import { Countdown } from "@components/countdown/countdown";
import Icon from "@svgs/icons/sq-icon";

import styles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

import { Competition } from "@custom-types/game-types";

interface Props {
  children: string | ReactNode;
  competition: Competition;
  latestSeason: string;
  predictionFreezeTime: Date;
  predictionsOpen: boolean;
}

/**If the predictions aren't open, say when they will be. If they are open, prompt people to edit and submit their predictions. If the predictions are frozen, hide this component entirely */
export const PredictionPromptCompetitionHp = ({
  children,
  competition,
  latestSeason,
  predictionFreezeTime,
  predictionsOpen,
}: Props) => {
  return (
    <>
      {!predictionsOpen ? (
        <p>Predictions will open once the entrants are confirmed.</p>
      ) : (
        predictionFreezeTime.getTime() > new Date().getTime() && (
          <>
            {children}
            <Countdown deadline={predictionFreezeTime} />
            <div className={styles.single}>
              <Link
                href={`/${competition}/${latestSeason}/predict`}
                className={btnStyles.button}>
                <Icon strokeWidth={2} type="listBullet" />
                Predict The Standings
              </Link>
            </div>
            <hr />
          </>
        )
      )}
    </>
  );
};
