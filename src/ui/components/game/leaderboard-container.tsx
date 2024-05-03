import { getlastUpdatedDate } from "@lib/db-functions";

import { PanelHeading } from "@components/panels/panel-heading";
import { GameContainer } from "@components/game/game-container";
import { DuoEntrantTypeGameContainer } from "@components/game/game-container-duo-entrantType";
import { Panel } from "@components/panels/panel";
import { PromptPredictions } from "@components/submit-predictions/prompt-predictions";

import { LocalSeasonData, User } from "@custom-types/game-types";

type Props = {
  currUser: User | null;
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
    competition,
    id: seasonStr,
    predictionFreezeTime,
    predictionsOpen,
    rounds,
  } = seasonData;

  const currUserId = currUser ? currUser?.id : null;
  const currUserDisplayName = currUser ? currUser?.displayName : null;

  //**Only bother getting the last updated date if there is leaderboard data to show */
  let lastUpdated;
  if (rounds.length > 0) {
    lastUpdated = await getlastUpdatedDate(seasonStr, competition);
  }

  const noOfEntrantTypes = Object.keys(rounds[0].standings).length;

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
            competition={competition}
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
              competition={competition}
              isSignedIn={Boolean(currUserDisplayName)}
              predictionFreezeTime={predictionFreezeTime}
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
