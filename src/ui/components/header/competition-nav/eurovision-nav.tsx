import HeaderLink from "@components/header/header-link";

import { Competition } from "@custom-types/game-types";

type Props = {
  competition: Competition;
  latestSeason: string;
  predictionFreezeTime: Date;
  predictionsOpen: boolean;
};

export const EurovisionNav = ({
  competition,
  latestSeason,
  predictionFreezeTime,
  predictionsOpen,
}: Props) => (
  <>
    {/**@todo Add year selector*/}
    {predictionFreezeTime.getTime() > new Date().getTime() &&
      predictionsOpen && (
        <HeaderLink
          href={`/${competition}/${latestSeason}/predict`}
          icon="listBullet">
          Submit Predictions
        </HeaderLink>
      )}
    <HeaderLink href={`/${competition}/${latestSeason}`} icon="microphone">
      Leaderboard
    </HeaderLink>
    <HeaderLink
      href={`/${competition}/${latestSeason}/stats/country`}
      icon="stats">
      Country Stats
    </HeaderLink>
    <HeaderLink
      href={`/${competition}/${latestSeason}/stats/player`}
      icon="group">
      Player Stats
    </HeaderLink>
  </>
);
