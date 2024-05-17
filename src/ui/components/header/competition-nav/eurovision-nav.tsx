import { Session } from "next-auth";

import HeaderLink from "@components/header/header-link";
import { SeasonSelector } from "../season-selector";

import { allEurovisionSeasonData } from "@data/eurovision/season-data";

import { Competition } from "@custom-types/game-types";

type Props = {
  competition: Competition;
  params: { season: string };
  session: Session | null;
};

export const EurovisionNav = ({ competition, params, session }: Props) => {
  /**If there is data for the season param then use that, otherwise use the latest season */
  const {
    arePredictionsFrozen,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = allEurovisionSeasonData.find(
    (seasonData) => seasonData.id === params.season
  ) || allEurovisionSeasonData[0];

  const hasMadePredictions =
    session?.user?.predictionsMadeFor?.[competition].includes(seasonStr);

  return (
    <>
      <SeasonSelector
        allLocalSeasonData={allEurovisionSeasonData}
        competitionStr={"Eurovision"}
        currentSeasonStr={seasonStr}
      />
      {rounds.length === 0 && arePredictionsFrozen && hasMadePredictions && (
        <HeaderLink
          href={`/${competition}/${seasonStr}/your-predictions`}
          icon="listBullet">
          View Your Predictions
        </HeaderLink>
      )}
      {!arePredictionsFrozen && predictionsOpen && (
        <HeaderLink
          href={`/${competition}/${seasonStr}/predict`}
          icon="listBullet">
          Submit Predictions
        </HeaderLink>
      )}
      <HeaderLink href={`/${competition}/${seasonStr}`} icon="microphone">
        Leaderboard
      </HeaderLink>
      <HeaderLink
        href={`/${competition}/${seasonStr}/stats/country`}
        icon="stats">
        Country Stats
      </HeaderLink>
      <HeaderLink
        href={`/${competition}/${seasonStr}/stats/player`}
        icon="group">
        Player Stats
      </HeaderLink>
    </>
  );
};
