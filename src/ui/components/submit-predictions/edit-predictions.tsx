"use client";

import { ReactNode, useState } from "react";

import { PanelHeading } from "@components/panels/panel-heading";
import { EditablePredictionTable } from "@components/submit-predictions/editable-prediction-table";
import { SubmitPredictions } from "@components/submit-predictions/submit-predictions";
import Icon from "@svgs/icons/sq-icon";

import { Entrant, LocalSeasonData } from "@custom-types/game-types";
import { User } from "next-auth";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnStyles from "@components/button/button.module.scss";
import btnConStyles from "@components/button/button-containers.module.scss";

interface Props {
  arePredictionsFrozen: boolean;
  children: string | ReactNode;
  displayName: string;
  entrantType: string;
  initialEntrants: Entrant[];
  season: string;
  seasonData: LocalSeasonData;
  currUser: User;
}

export const EditPredictions = ({
  arePredictionsFrozen,
  currUser,
  displayName,
  entrantType,
  initialEntrants,
  children,
  season,
  seasonData,
}: Props) => {
  const [entrantArr, setEntrantArr] = useState(initialEntrants);
  const { allEntrants, competitionStrs } = seasonData;

  const handleEntrantState = (entrantArr: Entrant[]) => {
    setEntrantArr(entrantArr);
  };
  return (
    <div className={styles.edit_predictions_con}>
      <div className={styles.infoCon}>
        <PanelHeading align="center">
          <h1>
            Predict the{" "}
            {competitionStrs.shortHand === "eurovision"
              ? `Eurovision ${season} Results`
              : `${competitionStrs.display} ${season} Standings`}
          </h1>
        </PanelHeading>

        {children}
        <SubmitPredictions
          allEntrantArrs={{ [entrantType]: entrantArr }}
          arePredictionsFrozen={arePredictionsFrozen}
          currUser={currUser}
          displayName={displayName}
          competitionStrs={competitionStrs}
          season={season}
        />
      </div>
      <div className={styles.prediction_tables}>
        <div className={styles.prediction_table_con}>
          <EditablePredictionTable
            allEntrants={allEntrants}
            competition={competitionStrs.shortHand}
            entrantArr={entrantArr}
            entrantType={entrantType}
            handleEntrantState={handleEntrantState}
          />
        </div>
      </div>
      <div className={btnConStyles.single}>
        <a
          href="#submit-predictions-con"
          className={`${btnStyles.button} ${styles.back_to_top_btn}`}>
          <Icon type={"up"} strokeWidth={2} />
          Back to top
        </a>
      </div>
    </div>
  );
};
