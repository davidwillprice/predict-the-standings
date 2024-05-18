import { Session } from "next-auth";

import HeaderLink from "@components/header/header-link";
import { SeasonSelector } from "../season-selector";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";

type Props = {
  params: { season: string };
  session: Session | null;
};

export const EurovisionNav = ({ params, session }: Props) => {
  /**If there is data for the season param then use that, otherwise use the latest season */
  const {
    arePredictionsFrozen,
    competitionStrs,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = allEurovisionSeasonData.find(
    (seasonData) => seasonData.id === params.season
  ) || allEurovisionSeasonData[0];

  const hasMadePredictions =
    session?.user?.predictionsMadeFor?.[competitionStrs.shortHand].includes(
      seasonStr
    );

  return (
    <>
      <SeasonSelector
        allLocalSeasonData={allEurovisionSeasonData}
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
          Submit Predictions
        </HeaderLink>
      )}
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}`}
        icon="microphone">
        Leaderboard
      </HeaderLink>
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}/stats/country`}
        icon="stats">
        Country Stats
      </HeaderLink>
      <HeaderLink
        href={`/${competitionStrs.hyphenated}/${seasonStr}/stats/player`}
        icon="group">
        Player Stats
      </HeaderLink>
    </>
  );
};
