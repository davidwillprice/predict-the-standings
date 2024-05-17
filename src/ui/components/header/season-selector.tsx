import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { AllLocalSeasonData } from "@custom-types/game-types";

import styles from "./season-selector.module.scss";

type Props = {
  allLocalSeasonData: AllLocalSeasonData;
  competitionStr: string;
  currentSeasonStr: string;
};

export const SeasonSelector = ({
  allLocalSeasonData,
  competitionStr,
  currentSeasonStr,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**If there is only one season's worth of data, don't bother showing the selector */
  if (allLocalSeasonData.length < 2) return;

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    const newSeasonStr = e.target.value;
    /**@todo This juggling of 'f1', 'formula-1' and 'Formula 1' is tiresome - Maybe I can make competition objects and then use whatever type of string I need at the time */
    const competitionHomepage = `/${
      competitionStr === "Formula 1"
        ? "formula-1"
        : competitionStr.toLowerCase()
    }/`;
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
          {competitionStr} {seasonData.id}
        </option>
      ))}
    </select>
  );
};
