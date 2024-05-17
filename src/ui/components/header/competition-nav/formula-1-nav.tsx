import { Session } from "next-auth";

import HeaderLink from "@components/header/header-link";
import { SeasonSelector } from "../season-selector";

import { allF1SeasonData } from "@data/formula-1/season-data";

type Props = {
  params: { season: string };
  session: Session | null;
};

export const Formula1Nav = ({ params, session }: Props) => {
  /**If there is data for the season param then use that, otherwise use the latest season */
  const {
    arePredictionsFrozen,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = allF1SeasonData.find((seasonData) => seasonData.id === params.season) ||
  allF1SeasonData[0];

  const hasMadePredictions =
    session?.user?.predictionsMadeFor?.["f1"].includes(seasonStr);

  return (
    <>
      <SeasonSelector
        allLocalSeasonData={allF1SeasonData}
        competitionStr={"Formula 1"}
        currentSeasonStr={seasonStr}
      />
      {rounds.length === 0 && arePredictionsFrozen && hasMadePredictions && (
        <HeaderLink
          href={`/formula-1/${seasonStr}/your-predictions`}
          icon="listBullet">
          View Your Predictions
        </HeaderLink>
      )}
      {!arePredictionsFrozen && predictionsOpen && (
        <HeaderLink href="/formula-1/2024/predict" icon="listBullet">
          Submit Predictions
        </HeaderLink>
      )}
      <HeaderLink
        customLinkActiveOptions={{
          href: `/formula-1/${seasonStr}`,
          includeQuery: false,
          query: ["leaderboard", "constructors"],
        }}
        href={`/formula-1/${seasonStr}`}
        icon="driver">
        Drivers Leaderboard
      </HeaderLink>
      <HeaderLink
        customLinkActiveOptions={{
          href: `/formula-1/${seasonStr}`,
          includeQuery: true,
          query: ["leaderboard", "constructors"],
        }}
        href={`/formula-1/${seasonStr}/?leaderboard=constructors`}
        icon="f1">
        Constructors Leaderboard
      </HeaderLink>
      <HeaderLink
        href={`/formula-1/${seasonStr}/stats/driver-and-team`}
        icon="stats">
        Driver & Team Stats
      </HeaderLink>
      <HeaderLink href={`/formula-1/${seasonStr}/stats/player`} icon="group">
        Player Stats
      </HeaderLink>
    </>
  );
};
