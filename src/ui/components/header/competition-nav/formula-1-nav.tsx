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
    competitionStrs,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = allF1SeasonData.find((seasonData) => seasonData.id === params.season) ||
  allF1SeasonData[0];

  const hasMadePredictions =
    session?.user?.predictionsMadeFor?.[competitionStrs.shortHand].includes(
      seasonStr
    );

  return (
    <>
      <SeasonSelector
        allLocalSeasonData={allF1SeasonData}
        competitionStrs={competitionStrs}
        currentSeasonStr={seasonStr}
      />
      {rounds.length === 0 && arePredictionsFrozen && hasMadePredictions && (
        <HeaderLink
          href={`/${competitionStrs.hyphenated}/${seasonStr}/your-predictions`}
          icon="listBullet">
          View Your Predictions
        </HeaderLink>
      )}
      {!arePredictionsFrozen && predictionsOpen && (
        <HeaderLink
          href={`/${competitionStrs.hyphenated}/2024/predict`}
          icon="listBullet">
          Submit Predictions
        </HeaderLink>
      )}
      <HeaderLink
        customLinkActiveOptions={{
          href: `/${competitionStrs.hyphenated}/${seasonStr}`,
          includeQuery: false,
          query: ["leaderboard", "constructors"],
        }}
        href={`/${competitionStrs.hyphenated}/${seasonStr}`}
        icon="driver">
        Drivers Leaderboard
      </HeaderLink>
      <HeaderLink
        customLinkActiveOptions={{
          href: `/${competitionStrs.hyphenated}/${seasonStr}`,
          includeQuery: true,
          query: ["leaderboard", "constructors"],
        }}
        href={`/${competitionStrs.hyphenated}/${seasonStr}/?leaderboard=constructors`}
        icon="f1">
        Constructors Leaderboard
      </HeaderLink>
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}/stats/driver-and-team`}
        icon="stats">
        Driver & Team Stats
      </HeaderLink>
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}/stats/player`}
        icon="group">
        Player Stats
      </HeaderLink>
    </>
  );
};
