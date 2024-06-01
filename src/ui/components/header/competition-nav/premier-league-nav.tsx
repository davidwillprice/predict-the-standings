import { Session } from "next-auth";

import HeaderLink from "@components/header/header-link";
import { SeasonSelector } from "../season-selector";

import { allPlSeasonData } from "@data/premier-league/season-data";
import { checkIfUserHasMadePrediction } from "@lib/misc";

type Props = {
  params: { season: string };
  session: Session | null;
};

export const PremierLeagueNav = ({ params, session }: Props) => {
  /**If there is data for the season param then use that, otherwise use the latest season */
  const {
    arePredictionsFrozen,
    competitionStrs,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = allPlSeasonData.find((seasonData) => seasonData.id === params.season) ||
  allPlSeasonData[0];

  const hasMadePredictions = checkIfUserHasMadePrediction(
    seasonStr,
    competitionStrs.shortHand,
    session?.user
  );

  return (
    <>
      <SeasonSelector
        allLocalSeasonData={allPlSeasonData}
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
          href={`/${competitionStrs.hyphenated}/${seasonStr}/predict`}
          icon="listBullet">
          {`${hasMadePredictions ? "Edit" : "Submit"} Predictions`}
        </HeaderLink>
      )}
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}`}
        icon="premierLeague">
        Leaderboard
      </HeaderLink>
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}/stats/team`}
        icon="stats">
        Team Stats
      </HeaderLink>
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}/stats/player`}
        icon="group">
        Player Stats
      </HeaderLink>
    </>
  );
};
