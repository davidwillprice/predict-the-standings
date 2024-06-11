import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ListBoxItem } from "react-aria-components";

import { ReactAriaDropdown } from "@components/dropdown/react-aria-dropdown";

import dropDownStyles from "@components/dropdown/react-aria-dropdown.module.scss";

import {
  AllLocalSeasonData,
  CompetitionStrings,
} from "@custom-types/game-types";

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

  /**If there is only one season's worth of data, don't bother showing the selector */
  if (allLocalSeasonData.length < 2) return;

  const handleSeasonChange = (selected: string) => {
    const currentSearchParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    const competitionHomepage = `/${competitionStrs.hyphenated}/`;
    const seasonalPages = `${competitionHomepage}${currentSeasonStr}`;
    /**If not on a seasonal page like a 404 or the competition homepage, navigate to the new season's leaderboard, else navigate to the same URL but with the season changed - searchParams included either way */
    const newPathname = pathname.startsWith(seasonalPages)
      ? pathname.replace(currentSeasonStr, selected)
      : `${competitionHomepage}/${selected}`;

    router.push(
      `${newPathname}${currentSearchParams ? "?" + currentSearchParams : ""}`
    );
  };
  return (
    <ReactAriaDropdown
      classNames={dropDownStyles.mob_margin_bottom_top}
      defaultKey={currentSeasonStr}
      items={allLocalSeasonData}
      labelText="Season Selector"
      onSelectionChangeFn={handleSeasonChange}
      showLabelElement={false}>
      {allLocalSeasonData.map((seasonData) => (
        <ListBoxItem
          id={seasonData.id}
          key={seasonData.id}
          isDisabled={seasonData.id === currentSeasonStr}
          className={({ isSelected }) =>
            `${dropDownStyles.listBoxItem} ${
              isSelected ? dropDownStyles.selected : ""
            }`
          }>
          {seasonData.competitionStrs.display} {seasonData.id}
        </ListBoxItem>
      ))}
    </ReactAriaDropdown>
  );
};
