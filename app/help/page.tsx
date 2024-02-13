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
        {/**@todo Update help text to cover football as well as F1 */}
        {/**@todo Add example prediction table and leaderboard */}
        <ol>
          <li>
            One penalty point is awarded for every position that a driver/team
            is from their actual standing - These are shown to the right of each
            predicted table row;
          </li>
          <li>
            If the player has made a perfect prediction, a green tick shows
            instead of the penalty points;
          </li>
          <li>
            The total penalty points for each player is shown at the bottom of
            their prediction tables;
          </li>
          <li>
            Each players&apos; accuracy rating in the leaderboard shows how
            close they are to a perfectly predicted table;
          </li>
          <li>
            The player(s) with the most accurate driver and constructor tables
            at the end of the season win.
          </li>
        </ol>
        <h2>Additional Info</h2>
        <ul>
          <li>
            If players have equal accuracy ratings, perfect predictions will be
            used a tie break, then predictions that were 1 off , then
            predictions that were 2 off etc.
          </li>
          <li>
            The &apos;Average&apos; prediction tables were worked out by
            calculating the mean position of each driver/team across the other
            player prediction tables;
          </li>
          <li>Stand-in drivers won&apos;t be added to the driver standings;</li>
          <li>
            Other than that, the game&apos;s standings will be ordered as they
            are in real life.
          </li>
        </ul>
      </Panel>
    </>
  );
};

export default Page;
