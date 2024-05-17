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
    /**Navigate to the same URL (searchParams included) but with the season changed */
    router.push(
      `${pathname.replace(currentSeasonStr, e.target.value)}${
        currentSearchParams ? "?" + currentSearchParams : ""
      }`
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
