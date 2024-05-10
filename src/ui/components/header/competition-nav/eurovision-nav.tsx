import { Session } from "next-auth";

import HeaderLink from "@components/header/header-link";

import { Competition, LocalSeasonData } from "@custom-types/game-types";

type Props = {
  competition: Competition;
  seasonData: LocalSeasonData;
  session: Session | null;
};

export const EurovisionNav = ({ competition, seasonData, session }: Props) => {
  const {
    arePredictionsFrozen,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = seasonData;
  const hasMadePredictions =
    session?.user?.predictionsMadeFor?.[competition].includes(seasonStr);

  return (
    <>
      {/**@todo Add year selector*/}
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
