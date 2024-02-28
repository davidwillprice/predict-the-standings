import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";
import { EntrantPredictions } from "@components/stats/entrant-predictions";

import styles from "@components/stats/stats.module.scss";

const Page = () => {
  /**@todo Stat for copying last years standings */
  /**@todo Record how many times people update their standings for a '"Jack submitted X predictions, Y more than anybody else. Indecisive."' stat */
  return (
    <>
      <PanelHeading>
        <h1>Formula 1 - Stats</h1>
      </PanelHeading>
      <Panel>
        <div className={styles.entrantPredictions}>
          <EntrantPredictions />
        </div>
      </Panel>
    </>
  );
};

export default Page;
