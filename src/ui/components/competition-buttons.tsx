import Link from "next/link";
import { Button } from "@components/button/button";
import Icon from "@svgs/icons/sq-icon";

import styles from "@components/button/button-containers.module.scss";
export const CompetitionButtons = () => (
  <>
    <hr />
    <div className={styles.tripleCol}>
      <Link href="/eurovision/">
        <Button>
          <Icon strokeWidth={2} type="microphone" />
          Eurovision
        </Button>
      </Link>
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
  </>
);
