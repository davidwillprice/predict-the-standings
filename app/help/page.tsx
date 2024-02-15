import { Metadata } from "next";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

export const metadata: Metadata = {
  title: "Help | Predict The Standings",
};
const Page = () => {
  return (
    <>
      <PanelHeading>
        <h1>Help</h1>
      </PanelHeading>
      <Panel>
        <h2>Rules</h2>
        {/**@todo Add example prediction table and leaderboard */}
        <ol>
          <li>
            The accuracy rating on the leaderboard and under their prediction
            table shows how close each player is to the actual standings;
          </li>
          <li>
            The player(s) with the most accurate prediction table at the end of
            the season wins;
          </li>
          <li>
            When viewing a prediction table, the number shown to the right of
            each driver/team denotes how many positions that driver/team was
            predicted away from their position in the actual standings;
          </li>
          <li>
            If the player has perfectly predicted a driver/team, a green tick
            shows next to the driver/team.
          </li>
        </ol>
        <h2>Additional Info</h2>
        <ul>
          <li>
            If players have equal accuracy ratings, perfect predictions will be
            used a tie break, then predictions that were 1 off, then predictions
            that were 2 off etc.
          </li>
          <li>
            The &apos;Average&apos; prediction tables were worked out by
            calculating the mean position of each driver/team across the other
            player prediction tables;
          </li>
          <li>
            For Formula 1, stand-in drivers will be ignored from the standings;
          </li>
          <li>
            Other than that, the actual standings will be ordered as they are in
            real life.
          </li>
        </ul>
      </Panel>
    </>
  );
};

export default Page;
