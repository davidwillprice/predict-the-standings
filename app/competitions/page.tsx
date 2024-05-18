import { Metadata } from "next";
import Link from "next/link";

import { allF1SeasonData } from "@data/formula-1/season-data";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import Icon from "@ui/svgs/icons/sq-icon";

import styles from "@styles/competitions.module.scss";
import btnStyles from "@components/button/button.module.scss";

export const metadata: Metadata = {
  title: "Competitions | Predict The Standings",
};

const Page = () => {
  const competitionData = [allEurovisionSeasonData[0], allF1SeasonData[0]];
  return (
    <>
      <PanelHeading>
        <h1>Competitions</h1>

        {competitionData.some(
          (competition) =>
            competition.predictionsOpen && !competition.arePredictionsFrozen
        ) ? (
          <p>
            Choose a competition to make predictions for, or view the
            leaderboard/standings/stats for an ongoing competition.
          </p>
        ) : (
          <>
            <p>
              Unfortunately there aren&apos;t any competitions available to make
              predictions for at the moment.
            </p>
            <p>Please return closer to the start of a new season.</p>
          </>
        )}
      </PanelHeading>
      <table className={styles.competitions}>
        <thead>
          <tr>
            <th>Competition</th>
            <th>Season</th>
            <th>Status</th>
            <th>Link</th>
          </tr>
        </thead>
        {/**@todo Need to add tbody element */}
        {competitionData.map((competition) => {
          const {
            arePredictionsFrozen,
            id: seasonStr,
            isSeasonOver,
            competitionStrs,
            predictionsOpen,
          } = competition;
          return (
            <tr key={competitionStrs.shortHand} className={styles.competition}>
              <td>
                <div className={styles.name}>
                  <Icon
                    type={
                      competitionStrs.shortHand === "eurovision"
                        ? "microphone"
                        : competitionStrs.shortHand === "f1"
                        ? "f1"
                        : "group"
                    }
                    strokeWidth={2}
                  />
                  <p>
                    {competitionStrs.display} <span> - {seasonStr}</span>
                  </p>
                </div>
              </td>
              <td className={styles.season}>{seasonStr}</td>
              <td className={styles.status}>
                {isSeasonOver
                  ? "Season Over"
                  : arePredictionsFrozen
                  ? "In Progress"
                  : predictionsOpen
                  ? "Predictions Open"
                  : "Predictions Upcoming"}
              </td>
              <td>
                {predictionsOpen && !arePredictionsFrozen ? (
                  <Link
                    href={`/${competitionStrs.hyphenated}/${seasonStr}/predict`}
                    className={btnStyles.button}>
                    Submit Predictions
                  </Link>
                ) : (
                  <Link
                    href={`/${competitionStrs.hyphenated}/${seasonStr}/`}
                    className={btnStyles.button}>
                    View Leaderboard
                  </Link>
                )}
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

export default Page;
