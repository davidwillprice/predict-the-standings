import Link from "next/link";

import Icon from "@svgs/icons/sq-icon";

import btnConStyles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

import { CompetitionStrings } from "@custom-types/game-types";
import { getSpecificGameDataIdFromSessionUser } from "@lib/misc";

import { UserDataFromSession } from "@custom-types/misc";

interface Props {
  arePredictionsFrozen: boolean;
  competitionStrs: CompetitionStrings;
  currUser: UserDataFromSession | null | undefined;
  predictionsOpen: boolean;
  seasonStr: string;
}

export const PromptPredictions = ({
  arePredictionsFrozen,
  competitionStrs,
  currUser,
  predictionsOpen,
  seasonStr,
}: Props) => {
  const hasMadePredictions = !!getSpecificGameDataIdFromSessionUser(
    seasonStr,
    competitionStrs.shortHand,
    currUser
  );

  return (
    !arePredictionsFrozen &&
    predictionsOpen && (
      <>
        <hr />
        <div className={btnConStyles.single}>
          <Link
            href={`/${competitionStrs.hyphenated}/${seasonStr}/predict`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type="listBullet" />
            {hasMadePredictions
              ? "Edit Your Predictions"
              : "Predict The Standings"}
          </Link>
        </div>
      </>
    )
  );
};
