import { Panel } from "@components/panels/panel";
import styles from "./maintenance.module.scss";
import Icon from "@ui/svgs/icons/sq-icon";

export const Maintenance = () => (
  <div className={styles.con}>
    <Panel>
      <div className={styles.logo}>
        <div className={styles.icon}>
          <Icon type="trophy" strokeWidth={2} />
        </div>
        Predict The Standings
      </div>
      <p>
        Predict The Standings is down temporarily for maintenance, please return
        later.
      </p>
    </Panel>
  </div>
);
