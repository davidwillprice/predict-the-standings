"use client";

import { ReactNode, useState } from "react";

import { PanelHeading } from "@components/panels/panel-heading";
import { EditablePredictionTable } from "@components/submit-predictions/editable-prediction-table";
import { SubmitPredictions } from "@components/submit-predictions/submit-predictions";
import Icon from "@svgs/icons/sq-icon";

import { Entrant, Competition } from "@custom-types/game-types";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnStyles from "@components/button/button.module.scss";
import btnConStyles from "@components/button/button-containers.module.scss";

interface Props {
  children: string | ReactNode;
  competition: Competition;
  displayName: string;
  initialEntrants: Entrant[];
  predictionFreezeTime: Date;
  season: string;
  userId: string;
}

export const EditPredictions = ({
  displayName,
  predictionFreezeTime,
  initialEntrants,
  children,
  season,
  competition,
  userId,
}: Props) => {
  const [entrantArr, setEntrantArr] = useState(initialEntrants);

  const handleEntrantState = (entrantArr: Entrant[]) => {
    setEntrantArr(entrantArr);
  };
  return (
    <div className={styles.edit_predictions_con}>
      <div className={styles.infoCon}>
        <PanelHeading align="center">
          <h1>
            Predict the{" "}
            {competition === "eurovision"
              ? `Eurovision ${season} Results`
              : `${competition} ${season} Standings`}
          </h1>
        </PanelHeading>

        {children}
        <SubmitPredictions
          allEntrantArrs={{ countries: entrantArr }}
          displayName={displayName}
          competition={competition}
          season={season}
          userId={userId}
          predictionFreezeTime={predictionFreezeTime}
        />
      </div>
      <div className={styles.prediction_tables}>
        <div className={styles.prediction_table_con}>
          <EditablePredictionTable
            competition={competition}
            entrantArr={entrantArr}
            entrantType={"Country"}
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
