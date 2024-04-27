import { Fragment } from "react";

import type { Entrant, EntrantId, Entrants } from "@custom-types/game-types";

import styles from "@components/stats/stats.module.scss";

interface HeadToHeadProps {
  teammates: Entrant[];
}
interface HeadToHeadsProps {
  driverIdArr: EntrantId[];
  allEntrants: { [key: string]: Entrants };
  teamIdArr: EntrantId[];
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
  const avgPosDifBetweenNo1AndNo2 =
    no1Driver.avgPrePos && no2Driver.avgPrePos
      ? Math.round((no2Driver.avgPrePos - no1Driver.avgPrePos) * 10) / 10
      : null;
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
      {avgPosDifBetweenNo1AndNo2 ? (
        <p className={styles.avgPos}>
          {avgPosDifBetweenNo1AndNo2 > 0
            ? `On average, people predicted ${
                no1Driver.name
              } would finish ${avgPosDifBetweenNo1AndNo2} position${
                avgPosDifBetweenNo1AndNo2 !== 1 ? "s" : ""
              } higher than ${no2Driver.name}.`
            : avgPosDifBetweenNo1AndNo2 < 0
            ? `However on average, ${
                no2Driver.name
              } was actually predicted to finish ${Math.abs(
                avgPosDifBetweenNo1AndNo2
              )} position${
                Math.abs(avgPosDifBetweenNo1AndNo2) !== 1 ? "s" : ""
              } higher than ${no1Driver.name}.`
            : `However, both ${no1Driver.name} and ${no2Driver.name} had the same average predicted finish position (${no1Driver.avgPrePos}).`}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export const HeadToHeads = ({
  driverIdArr,
  allEntrants,
  teamIdArr,
}: HeadToHeadsProps) => {
  const drivers = driverIdArr.map((id) => allEntrants["drivers"][id]);
  const teams = teamIdArr.map((id) => allEntrants["teams"][id]);
  return (
    <div className={styles.head_to_heads}>
      <h3>% of People Who Favoured Each&nbsp;Teammate</h3>
      {teams.map((team, index) => (
        <Fragment key={team.name}>
          <HeadToHead
            key={team.name}
            teammates={drivers.filter((driver) => driver.color === team.color)}
          />
          {index !== teams.length - 1 ? <hr /> : ""}
        </Fragment>
      ))}
    </div>
  );
};
