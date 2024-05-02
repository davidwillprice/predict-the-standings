import Link from "next/link";
import { Metadata, NextPage } from "next";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { LatestSeasonShowcase } from "@components/latest-season-showcase/latest-season-showcase";
import Icon from "@svgs/icons/sq-icon";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import styles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

import { CompetitionLink } from "@custom-types/misc";

export const metadata: Metadata = {
  title: "Predict The Eurovision Standings",
};

const Page: NextPage = async () => {
  const competition = "eurovision";
  const seasonData = allEurovisionSeasonData[0];
  const { id: seasonStr } = seasonData;

  return (
    <>
      <PanelHeading>
        <h1>Predict The Eurovision Standings</h1>
      </PanelHeading>
      <Panel>
        {/**@todo Add text for after the season has started */}
        <p>
          Compete against people around the world to predict the Eurovision
          Grand Final results.
        </p>
        <ul>
          <li>
            The leaderboards will be updated after the results are announced.
          </li>
          <li>
            View stats and trivia on how controversial your each of predictions
            are, and how accurately players have predicted each country&apos;s
            standing.
          </li>
        </ul>
      </Panel>
      <Panel>
        <h2>Eurovision Grand Finals {seasonStr}</h2>
        <LatestSeasonShowcase
          linkArr={[
            new CompetitionLink("", "microphone", "Leaderboard"),
            new CompetitionLink("stats/country", "stats", "Country Stats"),
            new CompetitionLink("stats/player", "group", "Player Stats"),
          ]}
          localSeasonData={allEurovisionSeasonData[0]}>
          <p>
            Predictions are now open! You have until the voting results start
            being announced to submit (and edit) your predictions.
          </p>
        </LatestSeasonShowcase>
      </Panel>
      <PanelHeading>
        <p>
          <small>
            This website is unofficial and is not associated in any way with
            Eurovision. Eurovision is a registered trademark of the EBU.
          </small>
        </p>
      </PanelHeading>
    </>
  );
};

export default Page;
