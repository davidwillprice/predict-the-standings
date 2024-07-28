import { Metadata } from "next";
import { generateOgImgUrl } from "@lib/misc";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { LatestSeasonShowcase } from "@components/latest-season-showcase/latest-season-showcase";

import { allF1SeasonData } from "@data/formula-1/season-data";

import { CompetitionLink } from "@custom-types/misc";

export const metadata: Metadata = {
  title: "Predict The Formula 1 Standings",
  description: "Compete to predict the driver and constructor tables",
  openGraph: {
    images: [
      {
        url: generateOgImgUrl("Formula 1", "f1"),
        alt: "Page screenshot",
      },
    ],
  },
};

const Page = () => {
  const { id: seasonStr } = allF1SeasonData[0];
  /**@todo! Add screenshots/video graphics to better encourage people to make predictions */
  return (
    <>
      <PanelHeading>
        <h1>Predict The Formula 1 Standings</h1>
      </PanelHeading>
      <Panel>
        {/**@todo Add text for after the season has started */}
        <p>
          Compete against people around the world to predict the driver and
          constructor standings for the Formula 1.
        </p>
        <ul>
          <li>
            The leaderboards will be updated after each round so you can see how
            your predictions are performing throughout the season.
          </li>
          <li>
            View stats and trivia on how controversial your each of predictions
            are, and how accurately players have predicted each driver&apos;s
            and constructor&apos;s standing.
          </li>
        </ul>
      </Panel>
      <Panel>
        <h2>Formula 1 {seasonStr}</h2>
        <LatestSeasonShowcase
          linkArr={[
            new CompetitionLink("", "driver", "Drivers Leaderboard"),
            new CompetitionLink(
              "?leaderboard=constructors",
              "f1",
              "Constructors Leaderboard"
            ),
            new CompetitionLink(
              "stats/driver-and-team",
              "stats",
              "Driver & Team Stats"
            ),
            new CompetitionLink("stats/player", "group", "Player Stats"),
          ]}
          localSeasonData={allF1SeasonData[0]}>
          <p>
            Predictions are now open! You have until the start of opening
            weekend&apos;s Free Practice 1 to submit (and edit) your
            predictions.
          </p>
        </LatestSeasonShowcase>
      </Panel>
      <PanelHeading>
        <p>
          <small>
            This website is unofficial and is not associated in any way with the
            Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE
            WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of
            Formula One Licensing B.V.
          </small>
        </p>
      </PanelHeading>
    </>
  );
};

export default Page;
