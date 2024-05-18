import { getlastUpdatedDate } from "@lib/db-functions";

import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { DuoEntrantTypeGameContainer } from "@components/game/game-container-duo-entrantType";
import { Panel } from "@components/panels/panel";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";

import { LocalSeasonData, UserGameData } from "@custom-types/game-types";

type Props = {
  currUser: UserGameData | null;
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

  const currUserId = currUser ? currUser?.id : null;
  const currUserDisplayName = currUser ? currUser?.displayName : null;

  //**Only bother getting the last updated date if there is leaderboard data to show */
  let lastUpdated;
  if (rounds.length > 0) {
    lastUpdated = await getlastUpdatedDate(
      seasonStr,
      competitionStrs.shortHand
    );
  }

  /**If there is no round data, assign this to null to prevent an error occurring */
  const noOfEntrantTypes =
    rounds.length > 0 ? Object.keys(rounds[0].standings).length : null;

  return (
    <>
      {rounds.length > 0 && lastUpdated ? (
        noOfEntrantTypes === 2 ? (
          <DuoEntrantTypeGameContainer
            currentUserDisplayName={currUserDisplayName}
            currentUserId={currUserId}
            currentSearchParams={searchParams}
            lastUpdated={lastUpdated}
            localSeasonData={JSON.parse(JSON.stringify(seasonData))}
            season={seasonStr}>
            <div>
              <h1>{headingText}</h1>
              <p>
                Select players to view their predictions and compare them to the
                actual standings.
              </p>
            </div>
          </DuoEntrantTypeGameContainer>
        ) : (
          <GameContainer
            competition={competitionStrs.shortHand}
            currentUserDisplayName={currUserDisplayName}
            currentUserId={currUserId}
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
        )
      ) : (
        <>
          <PanelHeading>
            <h1>{headingText}</h1>
          </PanelHeading>
          <Panel>
            <p>{preseasonText}</p>
            <PromptPredictions
              arePredictionsFrozen={arePredictionsFrozen}
              competition={competitionStrs.hyphenated}
              isSignedIn={Boolean(currUserDisplayName)}
              predictionsOpen={predictionsOpen}
              season={seasonStr}
            />
          </Panel>
          {/**@todo Re-enable preseason container once properly built - Or could have the below text show as a modal and then underneath a placeholder of what the leaderboard will look like?
           * <PreSeasonContainer />*/}
        </>
      )}
    </>
  );
};
