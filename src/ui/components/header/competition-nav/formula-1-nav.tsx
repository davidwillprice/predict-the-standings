import HeaderLink from "@components/header/header-link";

type Props = {
  latestSeason: string;
  predictionFreezeTime: Date;
  predictionsOpen: boolean;
};

export const Formula1Nav = ({
  latestSeason,
  predictionFreezeTime,
  predictionsOpen,
}: Props) => (
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
        href: `/formula-1/${latestSeason}`,
        includeQuery: false,
        query: ["leaderboard", "constructors"],
      }}
      href={`/formula-1/${latestSeason}`}
      icon="driver">
      Drivers Leaderboard
    </HeaderLink>
    <HeaderLink
      customLinkActiveOptions={{
        href: `/formula-1/${latestSeason}`,
        includeQuery: true,
        query: ["leaderboard", "constructors"],
      }}
      href={`/formula-1/${latestSeason}/?leaderboard=constructors`}
      icon="f1">
      Constructors Leaderboard
    </HeaderLink>
    <HeaderLink
      href={`/formula-1/${latestSeason}/stats/driver-and-team`}
      icon="stats">
      Driver & Team Stats
    </HeaderLink>
    <HeaderLink href={`/formula-1/${latestSeason}/stats/player`} icon="group">
      Player Stats
    </HeaderLink>
  </>
);
