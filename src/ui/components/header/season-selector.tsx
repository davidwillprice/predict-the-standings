import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  AllLocalSeasonData,
  CompetitionStrings,
} from "@custom-types/game-types";

import styles from "./season-selector.module.scss";

type Props = {
  allLocalSeasonData: AllLocalSeasonData;
  competitionStrs: CompetitionStrings;
  currentSeasonStr: string;
};

export const SeasonSelector = ({
  allLocalSeasonData,
  competitionStrs,
  currentSeasonStr,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  /**@todo! Style options - Currently the options have no font */
  /**If there is only one season's worth of data, don't bother showing the selector */
  if (allLocalSeasonData.length < 2) return;

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    const newSeasonStr = e.target.value;
    const competitionHomepage = `/${competitionStrs.hyphenated}/`;
    const seasonalPages = `${competitionHomepage}${currentSeasonStr}`;
    /**If not on a seasonal page like a 404 or the competition homepage, navigate to the new season's leaderboard, else navigate to the same URL but with the season changed - searchParams included either way */
    const newPathname = pathname.startsWith(seasonalPages)
      ? pathname.replace(currentSeasonStr, newSeasonStr)
      : `${competitionHomepage}/${newSeasonStr}`;

    router.push(
      `${newPathname}${currentSearchParams ? "?" + currentSearchParams : ""}`
    );
  };
  return (
    <select
      className={styles.select}
      name="season"
      value={currentSeasonStr}
      onChange={handleSeasonChange}>
      {allLocalSeasonData.map((seasonData) => (
        <option key={seasonData.id} value={seasonData.id}>
          {competitionStrs.display} {seasonData.id}
        </option>
      ))}
    </select>
  );
};
