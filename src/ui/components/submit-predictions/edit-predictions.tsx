"use client";

import { ReactNode, useState } from "react";

import { PanelHeading } from "@components/panels/panel-heading";
import { EditablePredictionTable } from "@components/submit-predictions/editable-prediction-table";
import { SubmitPredictions } from "@components/submit-predictions/submit-predictions";
import Icon from "@svgs/icons/sq-icon";

import { Entrant } from "@custom-types/game-types";
import { Sport } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnStyles from "@components/button/button.module.scss";
import btnConStyles from "@components/button/button-containers.module.scss";

interface Props {
  displayName: string;
  predictionFreezeTime: Date;
  children: string | ReactNode;
  initialDrivers: Entrant[];
  initialTeams: Entrant[];
  sport: Sport;
  season: string;
  userId: string;
}

export const EditPredictions = ({
  displayName,
  predictionFreezeTime,
  initialDrivers,
  initialTeams,
  children,
  season,
  sport,
  userId,
}: Props) => {
  const [driverArr, setDriverArr] = useState(initialDrivers);
  const [teamArr, setTeamArr] = useState(initialTeams);

  const handleDriverState = (entrantArr: Entrant[]) => {
    setDriverArr(entrantArr);
  };
  const handleTeamState = (entrantArr: Entrant[]) => {
    setTeamArr(entrantArr);
  };
  return (
    <div className={styles.edit_predictions_con}>
      <div className={styles.infoCon}>
        <PanelHeading align="center">
          <h1>Predict the F1 {season} Standings</h1>
        </PanelHeading>

        {children}
        <SubmitPredictions
          displayName={displayName}
          driverArr={driverArr}
          sport={sport}
          season={season}
          teamArr={teamArr}
          userId={userId}
          predictionFreezeTime={predictionFreezeTime}
        />
      </div>
      <div className={styles.prediction_tables}>
        <div className={styles.prediction_table_con}>
          <EditablePredictionTable
            entrantArr={driverArr}
            entrantType={"Driver"}
            handleEntrantState={handleDriverState}
          />
        </div>
        <div className={styles.prediction_table_con}>
          <EditablePredictionTable
            entrantArr={teamArr}
            entrantType={"Team"}
            handleEntrantState={handleTeamState}
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
