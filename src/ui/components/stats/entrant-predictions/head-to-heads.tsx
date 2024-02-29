import { sortEntrantsAlphabetically } from "@lib/misc";

import type { Entrant } from "@custom-types/game-types";

import styles from "@components/stats/stats.module.scss";

interface HeadToHeadProps {
  teammates: Entrant[];
}
interface HeadToHeadsProps {
  drivers: Entrant[];
  teams: Entrant[];
}

const HeadToHead = ({ teammates }: HeadToHeadProps) => {
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
      <div
        className={styles.con}
        style={{
          backgroundColor: no1Driver.color,
          color: no1Driver.contrastColor,
        }}>
        {/**@todo Add rough logo or subtle team text to background of head to heads */}
        {/**@todo When season ends, tick which driver actually won the head to head */}
        <div className={styles.driver_details}>
          <p>
            {no1Driver.pcPredictedToBeatTeammate}% {no1Driver.name}
          </p>
        </div>
        <div className={styles.driver_details}>
          <p>
            {no2Driver.name} {no2Driver.pcPredictedToBeatTeammate}%
          </p>
        </div>
        <div
          className={styles.bg}
          style={{ width: no2Driver.pcPredictedToBeatTeammate + "%" }}
        />
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

export const HeadToHeads = ({ drivers, teams }: HeadToHeadsProps) => (
  <div className={styles.head_to_heads}>
    <h3>% of People Who Favoured Each&nbsp;Teammate</h3>
    {teams.map((team, index) => (
      <>
        <HeadToHead
          key={team.name}
          teammates={drivers.filter((driver) => driver.color === team.color)}
        />
        {index !== teams.length - 1 ? <hr /> : ""}
      </>
    ))}
  </div>
);
