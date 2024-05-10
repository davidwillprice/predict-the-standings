import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { notFound } from "next/navigation";

import { FlagCell } from "@components/prediction-table/eurovision-flag-cell";

import { getSingleUserPredictionDataQuery } from "@lib/db-functions";
import { authOptions } from "@lib/auth";
import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { PanelHeading } from "@components/panels/panel-heading";
import predictionTableStyles from "@components/prediction-table/prediction-table.module.scss";
import styles from "@components/submit-predictions/editable-prediction-table.module.scss";

import { PageProps } from "@custom-types/misc";
import { Entrant } from "@custom-types/game-types";

export const metadata: Metadata = {
  title: "View Your Eurovision Predictions | Predict The Standings",
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { season } = params;
  const seasonData = allEurovisionSeasonData.find(
    (seasonData) => seasonData.id === season
  );
  if (seasonData === undefined) notFound();
  const session = await getServerSession(authOptions);
  const displayName = session?.user.displayName;
  if (session == null) {
    return redirect("/login?error=login");
  } else if (!displayName) {
    return redirect("/get-started");
  }

  const competition = "eurovision";
  const { allEntrants } = seasonData;
  const { countries } = allEntrants;
  const userId = session.user.id;

  let predictionArr: Entrant[] = [];
  try {
    const userPredictionData = await getSingleUserPredictionDataQuery(
      season,
      competition,
      userId
    );
    predictionArr = userPredictionData.predictions.countries.map(
      (entrant: string) => countries[entrant]
    );
  } catch (_) {
    new Error("Couldn't obtain your predictions");
  }

  return (
    <>
      <PanelHeading>
        <h1>Your Eurovision {season} Grand Final - Predictions</h1>
      </PanelHeading>
      <div
        className={`${predictionTableStyles.prediction_table} ${
          styles.editable_prediction_table
        } ${
          Object.keys(allEntrants).length === 1
            ? styles.single_entrant_type_table
            : ""
        }`}
        style={{ maxWidth: "800px", margin: "0 auto 30px" }}>
        <table>
          <tbody
            style={{
              gridTemplateRows: `repeat(${Math.ceil(
                predictionArr.length / 2
              )}, auto)`,
            }}>
            {predictionArr.map((entrant, index) => (
              <tr
                key={entrant.sName}
                className={`${predictionTableStyles.table_row} ${styles.table_row}`}>
                <td className={predictionTableStyles.drag_cell}>≡</td>
                <td className={predictionTableStyles.position_cell}>
                  {index !== null ? index + 1 : " "}
                </td>
                {competition === "eurovision" ? (
                  <FlagCell country={entrant} />
                ) : (
                  <td className={predictionTableStyles.flair_cell}>
                    <span
                      className={`${predictionTableStyles.flair}`}
                      style={{ backgroundColor: entrant.color }}></span>
                  </td>
                )}
                <td
                  className={`${predictionTableStyles.name_cell} ${
                    entrant.name.length > 11 && predictionTableStyles.large_name
                  }`}>
                  <span className={predictionTableStyles.name}>
                    {entrant.name}
                  </span>
                  <span className={predictionTableStyles.sName}>
                    {entrant.sName}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Page;
