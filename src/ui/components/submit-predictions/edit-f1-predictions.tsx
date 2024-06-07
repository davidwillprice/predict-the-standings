"use client";

import { ReactNode, useState } from "react";

import { PanelHeading } from "@components/panels/panel-heading";
import { EditablePredictionTable } from "@components/submit-predictions/editable-prediction-table";
import { SubmitPredictions } from "@components/submit-predictions/submit-predictions";
import Icon from "@svgs/icons/sq-icon";

import { Entrant, LocalSeasonData } from "@custom-types/game-types";
import { UserDataFromSession } from "@custom-types/misc";

import styles from "@components/submit-predictions/submit-predictions.module.scss";
import btnStyles from "@components/button/button.module.scss";
import btnConStyles from "@components/button/button-containers.module.scss";

interface Props {
  arePredictionsFrozen: boolean;
  currUser: UserDataFromSession;
  children: string | ReactNode;
  displayName: string;
  initialDrivers: Entrant[];
  initialTeams: Entrant[];
  season: string;
  seasonData: LocalSeasonData;
}

export const EditF1Predictions = ({
  arePredictionsFrozen,
  displayName,
  initialDrivers,
  initialTeams,
  children,
  seasonData,
  season,
  currUser,
}: Props) => {
  const [driverArr, setDriverArr] = useState(initialDrivers);
  const [teamArr, setTeamArr] = useState(initialTeams);

  const handleDriverState = (entrantArr: Entrant[]) => {
    setDriverArr(entrantArr);
  };
  const handleTeamState = (entrantArr: Entrant[]) => {
    setTeamArr(entrantArr);
  };

  const { allEntrants, competitionStrs } = seasonData;
  return (
    <>
      <div className={styles.edit_predictions_con}>
        <div className={styles.infoCon}>
          <PanelHeading align="center">
            <h1>Predict the F1 {season} Standings</h1>
          </PanelHeading>
          {children}
          <SubmitPredictions
            allEntrantArrs={{ drivers: driverArr, teams: teamArr }}
            arePredictionsFrozen={arePredictionsFrozen}
            competitionStrs={competitionStrs}
            displayName={displayName}
            season={season}
            currUser={currUser}
          />
        </div>
        <div className={styles.prediction_tables}>
          <div className={styles.prediction_table_con}>
            <EditablePredictionTable
              allEntrants={allEntrants}
              competition={competitionStrs.shortHand}
              entrantArr={driverArr}
              entrantType={"drivers"}
              handleEntrantState={handleDriverState}
            />
          </div>
          <div className={styles.prediction_table_con}>
            <EditablePredictionTable
              allEntrants={allEntrants}
              competition={competitionStrs.shortHand}
              entrantArr={teamArr}
              entrantType={"teams"}
              handleEntrantState={handleTeamState}
            />
          </div>
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
    </>
  );
};
