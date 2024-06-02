import { getlastUpdatedDate } from "@lib/db-functions";

import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { Panel } from "@components/panels/panel";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";

import { LocalSeasonData } from "@custom-types/game-types";
import { User } from "next-auth";

type Props = {
  currUser: User | undefined;
  headingText: string;
  preseasonText: string;
  searchParams: { [key: string]: string | string[] | undefined };
  seasonData: LocalSeasonData;
};

export const LeaderboardContainer = async ({
  currUser,
  headingText,
  preseasonText,
  searchParams,
  seasonData,
}: Props) => {
  const {
    arePredictionsFrozen,
    competitionStrs,
    id: seasonStr,
    predictionsOpen,
    rounds,
  } = seasonData;

  //**Only bother getting the last updated date if there is leaderboard data to show */
  let lastUpdated;
  if (rounds.length > 0) {
    lastUpdated = await getlastUpdatedDate(
      seasonStr,
      competitionStrs.shortHand
    );
  }
  return (
    <>
      {rounds.length > 0 && lastUpdated ? (
        <GameContainer
          currUser={currUser}
          currentSearchParams={searchParams}
          lastUpdated={lastUpdated}
          localSeasonData={JSON.parse(JSON.stringify(seasonData))}
          rounds={JSON.parse(JSON.stringify(rounds))}
          season={seasonStr}>
          <div>
            <h1>{headingText}</h1>
            <p>
              Select players to view their predictions and compare them to the
              actual results.
            </p>
          </div>
        </GameContainer>
      ) : (
        <>
          <PanelHeading>
            <h1>{headingText}</h1>
          </PanelHeading>
          <Panel>
            <p>{preseasonText}</p>
            <PromptPredictions
              arePredictionsFrozen={arePredictionsFrozen}
              competitionStrs={competitionStrs}
              currUser={currUser}
              predictionsOpen={predictionsOpen}
              seasonStr={seasonStr}
            />
          </Panel>
          {/**@todo Re-enable preseason container once properly built - Or could have the below text show as a modal and then underneath a placeholder of what the leaderboard will look like?
           * <PreSeasonContainer />*/}
        </>
      )}
    </>
  );
};
