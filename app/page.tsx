import { PanelHeading } from "@components/panels/panel-heading";
import { Panel } from "@components/panels/panel";
import { CompetitionButtons } from "@components/competition-buttons";

export default function Home() {
  /**@todo! Add screenshots/video graphics to better encourage people to make predictions */
  return (
    <>
      <PanelHeading>
        <h1>Predict The Standings</h1>
      </PanelHeading>
      <Panel>
        <p>
          Compete against people around the world to Predict The Standings for
          various sports and competitions.
        </p>
        <ul>
          <li>
            For sports, the leaderboard will be updated after each round so you
            can see how your predictions are performing throughout the season.
          </li>
          <li>
            View stats and trivia on how controversial your each of predictions
            are, and how accurately players have predicted each
            driver/team/country&apos;s standing.
          </li>
        </ul>
        <CompetitionButtons />
      </Panel>
    </>
  );
}
