import Link from "next/link";

import Icon from "@svgs/icons/sq-icon";

import btnConStyles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

import { Competition } from "@custom-types/game-types";

interface Props {
  competition: Competition;
  isSignedIn: boolean;
  predictionFreezeTime: Date;
  predictionsOpen: boolean;
  season: string;
}

export const PromptPredictions = ({
  competition,
  isSignedIn,
  predictionFreezeTime,
  predictionsOpen,
  season,
}: Props) => {
  return (
    predictionFreezeTime.getTime() > new Date().getTime() &&
    predictionsOpen && (
      <>
        <hr />
        <div className={btnConStyles.single}>
          <Link
            href={`/${
              competition === "f1" ? "formula-1" : competition
            }/${season}/predict`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="listBullet" />
            {isSignedIn ? "Edit Your Predictions" : "Predict The Standings"}
          </Link>
        </div>
      </>
    )
  );
};
