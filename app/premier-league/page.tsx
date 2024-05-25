import { Metadata } from "next";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { LatestSeasonShowcase } from "@components/latest-season-showcase/latest-season-showcase";

import { allPlSeasonData } from "@data/premier-league/season-data";

import { CompetitionLink } from "@custom-types/misc";

export const metadata: Metadata = {
  title: "Predict The Premier League Standings",
};

const Page = () => {
  const { id: seasonStr } = allPlSeasonData[0];
  return (
    <>
      <PanelHeading>
        <h1>Predict The Premier League Standings</h1>
      </PanelHeading>
      <Panel>
        {/**@todo Add text for after the season has started */}
        <p>
          Compete against people around the world to predict the Premier League
          table.
        </p>
        <ul>
          <li>
            The leaderboards will be updated after each gameweek so you can see
            how your predictions are performing throughout the season.
          </li>
          <li>
            View stats and trivia like how controversial your each of
            predictions are, how accurately players have predicted each team,
            and more.
          </li>
        </ul>
      </Panel>
      <Panel>
        <h2>Premier League {seasonStr}</h2>
        <LatestSeasonShowcase
          linkArr={[
            new CompetitionLink("", "premierLeague", "Leaderboard"),
            new CompetitionLink("stats/team", "stats", "Team Stats"),
            new CompetitionLink("stats/player", "group", "Player Stats"),
          ]}
          localSeasonData={allPlSeasonData[0]}>
          <p>
            Predictions are now open! You have until the start of the first game
            to submit (and edit) your predictions.
          </p>
        </LatestSeasonShowcase>
      </Panel>
      <PanelHeading>
        <p>
          <small>
            This website is unofficial and is not associated in any way with the
            Premier League. Premier League is a registered trademark of The
            Football Association Premier League Limited.
          </small>
        </p>
      </PanelHeading>
      {/**@todo Add starts on how accurate the average predictions have been for each season */}
    </>
  );
};

export default Page;
