import { Metadata } from "next";

import { allPlSeasonData } from "@data/premier-league/season-data";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EntrantRow } from "@components/entrant-table/entrant-row";

import styles from "@styles/help.module.scss";
import entrantTableStyles from "@components/entrant-table/entrant-table.module.scss";
import { generateOgImgUrl } from "@lib/misc";

export const metadata: Metadata = {
  title: "Help | Predict The Standings",
  description: "Learn how the game works and how to play",
  openGraph: {
    images: [
      {
        url: generateOgImgUrl("Help", "help"),
        alt: "Page screenshot",
      },
    ],
  },
};

const BlankTableRow = () => (
  <tr className={entrantTableStyles.table_row}>
    <td className={entrantTableStyles.position_cell}>
      <span className={styles.gradient}></span>
    </td>
    <td>
      <span
        className={`${entrantTableStyles.flair}`}
        style={{
          backgroundColor: "var(--tertiary-color)",
        }}></span>
    </td>
    <td className={entrantTableStyles.name_cell}></td>
    <td className={`${entrantTableStyles.pos_diff_cell}`}></td>
  </tr>
);

const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Help</h1>
      </PanelHeading>
      <Panel>
        <h2>How Does It Work?</h2>
        <ol>
          <li>
            <p>
              The accuracy percentage on the leaderboard shows how close each
              player is to the actual standings.
            </p>
            <ul>
              <li>
                100% accuracy means they perfectly predicted the standings.
              </li>
              <li>
                Below 50% accuracy means they would likely have been better off
                randomising their predictions.
              </li>
              <li>
                0% accuracy means their predictions couldn&apos;t have been
                further from the actual standings.
              </li>
            </ul>
          </li>

          <li>
            The player with the most accurate prediction table at the end of the
            season wins.
          </li>
          <li>
            If players have equal accuracy percentages, how many entrants
            (teams/drivers/countries etc) they perfectly predicted will be used
            a tie break. Then how many predictions were 1 off, then how many
            predictions were 2 off etc.
          </li>
          <li>
            If players made identical predictions, they will be ordered by who
            made submitted their predictions first.
          </li>
        </ol>
      </Panel>
      <div className={styles.example_con}>
        <div className={styles.example}>
          <h2>Example Prediction Table</h2>
          <table className={entrantTableStyles.table}>
            <tbody>
              <BlankTableRow />
              <EntrantRow
                entrant={allPlSeasonData[0].allEntrants["teams"]["mci"]}
                index={1}
                posDiff={0}
                shortHandCompStr={allPlSeasonData[0].competitionStrs.shortHand}
              />
              <EntrantRow
                entrant={allPlSeasonData[0].allEntrants["teams"]["ars"]}
                index={2}
                posDiff={5}
                shortHandCompStr={allPlSeasonData[0].competitionStrs.shortHand}
              />
              <EntrantRow
                entrant={allPlSeasonData[0].allEntrants["teams"]["che"]}
                index={3}
                posDiff={-2}
                shortHandCompStr={allPlSeasonData[0].competitionStrs.shortHand}
              />
              <BlankTableRow />
            </tbody>
          </table>
        </div>
        <Panel>
          <p>
            This is a part of an example Premier League prediction table where
            the entrants are football teams.
          </p>
          <ol>
            <li>
              They correctly predicted Manchester City would finish 2nd so the
              green tick denotes a perfect prediction.
            </li>
            <li>
              They predicted Arsenal would finish third, 5 positions above where
              they actually finished.
            </li>
            <li>
              They predicted Chelsea would finish fourth, 2 positions below
              where they actually finished.
            </li>
          </ol>
        </Panel>
      </div>
      <Panel>
        <h2>Additional Info</h2>
        <ul>
          <li>
            The &apos;Average&apos; prediction table is worked out by
            calculating the mean position of each driver/team across
            everyone&apos; player prediction tables.
          </li>
          <li>
            For Formula 1, stand-in drivers and new mid-season drivers will be
            ignored from the standings.
          </li>
          <li>
            Other than that, the actual standings will be ordered as they are in
            real life (including factors like point deductions).
          </li>
        </ul>
      </Panel>
    </>
  );
};

export default Page;
