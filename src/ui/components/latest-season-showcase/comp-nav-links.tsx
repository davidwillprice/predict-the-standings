import Link from "next/link";

import Icon from "@svgs/icons/sq-icon";

import { LocalSeasonData } from "@custom-types/game-types";
import { CompetitionLink } from "@custom-types/misc";

import styles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

interface Props {
  localSeasonData: LocalSeasonData;
  linkArr: CompetitionLink[];
  showHelp: boolean;
}

export const CompetitionNavLinks = ({
  linkArr,
  showHelp,
  localSeasonData,
}: Props) => {
  const { competition, id: seasonStr, rounds } = localSeasonData;
  const competitionDir = competition === "f1" ? "formula-1" : competition;
  return (
    <div className={styles.doubleCol}>
      {rounds.length > 0 &&
        linkArr.map((link) => (
          <Link
            key={link.icon}
            href={`/${competitionDir}/${seasonStr}/${link.href}`}
            className={btnStyles.button}>
            <Icon strokeWidth={2} type={link.icon} />
            {link.text}
          </Link>
        ))}
      {showHelp && (
        <Link href="/help" className={btnStyles.button}>
          <Icon strokeWidth={2} type="help" />
          Help
        </Link>
      )}
    </div>
  );
};
