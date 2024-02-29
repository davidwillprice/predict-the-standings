import type { Entrant } from "@custom-types/game-types";

import styles from "@components/stats/stats.module.scss";

interface Props {
  teammates: Entrant[];
}

export const HeadToHead = ({ teammates }: Props) => {
  let no1Driver;
  let no2Driver;
  if (
    typeof teammates[0].pcPredictedToBeatTeammate === "number" &&
    typeof teammates[1].pcPredictedToBeatTeammate === "number"
  ) {
    if (
      teammates[0].pcPredictedToBeatTeammate >
      teammates[1].pcPredictedToBeatTeammate
    ) {
      no1Driver = teammates[0];
      no2Driver = teammates[1];
    } else {
      no1Driver = teammates[1];
      no2Driver = teammates[0];
    }
  } else {
    throw new Error("No driver head to head data");
  }

  return (
    <div className={styles.head_to_head}>
      <h3>% of People Who Favoured Each&nbsp;Teammate</h3>
      <div
        className={styles.con}
        style={{
          backgroundColor: no1Driver.color,
          color: no1Driver.contrastColor,
        }}>
        <div
          className={styles.bg}
          style={{ width: no2Driver.pcPredictedToBeatTeammate + "%" }}
        />
        <div className={styles.driver_details}>
          {no1Driver.pcPredictedToBeatTeammate}% {no1Driver.name}
        </div>
        <div className={styles.driver_details}>
          {no2Driver.name} {no2Driver.pcPredictedToBeatTeammate}%
        </div>
      </div>
      {no1Driver.avgPrePos && no2Driver.avgPrePos ? (
        <p className={styles.avgPos}>
          On average, people predicted {no1Driver.name} would finish{" "}
          {Math.round((no2Driver.avgPrePos - no1Driver.avgPrePos) * 10) / 10}{" "}
          positions higher than {no2Driver.name}.
        </p>
      ) : (
        ""
      )}
    </div>
  );
};
