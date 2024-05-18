import Link from "next/link";

import Icon from "@svgs/icons/sq-icon";

import btnConStyles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

import { DisplayCompStr } from "@custom-types/game-types";

interface Props {
  arePredictionsFrozen: boolean;
  competition: DisplayCompStr;
  isSignedIn: boolean;
  predictionsOpen: boolean;
  season: string;
}

export const PromptPredictions = ({
  arePredictionsFrozen,
  competition,
  isSignedIn,
  predictionsOpen,
  season,
}: Props) => {
  return (
    !arePredictionsFrozen &&
    predictionsOpen && (
      <>
        <hr />
        <div className={btnConStyles.single}>
          <Link
            href={`/${competition}/${season}/predict`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="listBullet" />
            {isSignedIn ? "Edit Your Predictions" : "Predict The Standings"}
          </Link>
        </div>
      </>
    )
  );
};
