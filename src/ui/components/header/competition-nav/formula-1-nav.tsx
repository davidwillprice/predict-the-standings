import HeaderLink from "@components/header/header-link";

import { LocalSeasonData } from "@custom-types/game-types";

type Props = {
  seasonData: LocalSeasonData;
};

export const Formula1Nav = ({ seasonData }: Props) => {
  const { id: seasonStr, predictionFreezeTime, predictionsOpen } = seasonData;
  return (
    <>
      {/**@todo Add year selector*/}
      {predictionFreezeTime.getTime() > new Date().getTime() &&
        predictionsOpen && (
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
