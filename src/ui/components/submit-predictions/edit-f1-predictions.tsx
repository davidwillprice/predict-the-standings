"use client";

import { ReactNode, useState } from "react";

import { PanelHeading } from "@components/panels/panel-heading";
import { EditablePredictionTable } from "@components/submit-predictions/editable-prediction-table";
import { SubmitPredictions } from "@components/submit-predictions/submit-predictions";
import Icon from "@svgs/icons/sq-icon";

import {
  Competition,
  Entrant,
  LocalSeasonData,
} from "@custom-types/game-types";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnStyles from "@components/button/button.module.scss";
import btnConStyles from "@components/button/button-containers.module.scss";

interface Props {
  arePredictionsFrozen: boolean;
  competition: Competition;
  displayName: string;
  children: string | ReactNode;
  initialDrivers: Entrant[];
  initialTeams: Entrant[];
  season: string;
  seasonData: LocalSeasonData;
  userId: string;
}

export const EditF1Predictions = ({
  arePredictionsFrozen,
  competition,
  displayName,
  initialDrivers,
  initialTeams,
  children,
  seasonData,
  season,
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

  const { allEntrants } = seasonData;
  return (
    <div className={styles.edit_predictions_con}>
      <div className={styles.infoCon}>
        <PanelHeading align="center">
          <h1>Predict the F1 {season} Standings</h1>
        </PanelHeading>
        {children}
        <SubmitPredictions
          allEntrantArrs={{ drivers: driverArr, teams: teamArr }}
          arePredictionsFrozen={arePredictionsFrozen}
          competition={competition}
          displayName={displayName}
          season={season}
          userId={userId}
        />
      </div>
      <div className={styles.prediction_tables}>
        <div className={styles.prediction_table_con}>
          <EditablePredictionTable
            allEntrants={allEntrants}
            competition={competition}
            entrantArr={driverArr}
            entrantType={"drivers"}
            handleEntrantState={handleDriverState}
          />
        </div>
        <div className={styles.prediction_table_con}>
          <EditablePredictionTable
            allEntrants={allEntrants}
            competition={competition}
            entrantArr={teamArr}
            entrantType={"teams"}
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
