import Link from "next/link";

import { PanelHeading } from "@components/panels/panel-heading";
import { Panel } from "@components/panels/panel";
import { Button } from "@components/button/button";
import Icon from "@svgs/icons/sq-icon";

import styles from "@components/button/button-containers.module.scss";

export default function Home() {
  return (
    <>
      <PanelHeading>
        <h1>Predict The Standings</h1>
      </PanelHeading>
      <Panel>
        <p>
          Compete against people around the world to Predict The Standings for
          various sports.
        </p>
        <ul>
          <li>
            The leaderboard will be updated after each round so you can see how
            your predictions are performing throughout the season.
          </li>
          <li>
            View stats and trivia on how controversial your each of predictions
            are, and how accurately players have predicted each
            driver/team&apos;s standing.
          </li>
        </ul>
        <hr />
        <div className={styles.double}>
          <Link href="/formula-1/">
            <Button>
              <Icon strokeWidth={2} type="f1" />
              Formula 1
            </Button>
          </Link>
          <Link href="/premier-league/">
            <Button>
              <Icon strokeWidth={2} type="premierLeague" />
              Premier League
            </Button>
          </Link>
        </div>
      </Panel>
    </>
  );
}
