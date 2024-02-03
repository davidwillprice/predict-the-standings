"use client";

import { ReactNode, useState } from "react";

import { EditablePredictionTable } from "@components/submit-predictions/editable-prediction-table";
import { SubmitPredictions } from "@components/submit-predictions/submit-predictions";

import { F1DriverEntrant } from "@custom-types/entrants";
import { Sport } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";

interface Props {
  predictionFreezeDate: Date;
  children: string | ReactNode;
  initialEntrants: F1DriverEntrant[];
  sport: Sport;
  season: string;
}

export const EditPredictions = ({
  predictionFreezeDate,
  initialEntrants,
  children,
  season,
  sport,
}: Props) => {
  const [entrantArr, setEntrantArr] = useState(initialEntrants);
  //const [predictionsLocked, lockPredictions] = useState(false);

  const handleEntrantState = (entrantArr: F1DriverEntrant[]) => {
    setEntrantArr(entrantArr);
  };
  return (
    <>
      <div className={styles.predictionTableCon}>
        <EditablePredictionTable
          entrantArr={entrantArr}
          handleEntrantState={handleEntrantState}
        />
      </div>
      <div className={styles.infoCon}>
        {children}
        <SubmitPredictions
          entrantArr={entrantArr}
          sport={sport}
          season={season}
        />
      </div>
    </>
  );
};
