import HeaderLink from "@components/header/header-link";

import { Competition, LocalSeasonData } from "@custom-types/game-types";

type Props = {
  competition: Competition;
  seasonData: LocalSeasonData;
};

export const EurovisionNav = ({ competition, seasonData }: Props) => {
  const { arePredictionsFrozen, id: seasonStr, predictionsOpen } = seasonData;
  return (
    <>
      {/**@todo Add year selector*/}
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
