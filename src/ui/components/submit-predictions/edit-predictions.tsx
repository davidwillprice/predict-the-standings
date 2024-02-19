"use client";

import { ReactNode, useState } from "react";

import { PanelHeading } from "@components/panels/panel-heading";
import { EditablePredictionTable } from "@components/submit-predictions/editable-prediction-table";
import { SubmitPredictions } from "@components/submit-predictions/submit-predictions";

import { Entrant } from "@custom-types/game-types";
import { Sport } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";

interface Props {
  predictionFreezeTime: Date;
  children: string | ReactNode;
  initialEntrants: Entrant[];
  sport: Sport;
  season: string;
  userId: number;
}

export const EditPredictions = ({
  predictionFreezeTime,
  initialEntrants,
  children,
  season,
  sport,
  userId,
}: Props) => {
  const [entrantArr, setEntrantArr] = useState(initialEntrants);
  //const [predictionsLocked, lockPredictions] = useState(false);

  const handleEntrantState = (entrantArr: Entrant[]) => {
    setEntrantArr(entrantArr);
  };
  return (
    <div className={styles.edit_predictions_con}>
      <div className={styles.infoCon}>
        <PanelHeading align="center">
          <h1>Predict the F1 {season} Standings</h1>
        </PanelHeading>

        {children}
        <SubmitPredictions
          entrantArr={entrantArr}
          sport={sport}
          season={season}
          userId={userId}
          predictionFreezeTime={predictionFreezeTime}
        />
      </div>
      <div className={styles.prediction_table_con}>
        <EditablePredictionTable
          entrantArr={entrantArr}
          handleEntrantState={handleEntrantState}
        />
      </div>
    </div>
  );
};
