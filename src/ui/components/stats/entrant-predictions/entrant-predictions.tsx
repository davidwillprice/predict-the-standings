"use client";

import { useState } from "react";
import { ReactAriaDropdown } from "@components/dropdown/react-aria-dropdown";
import { ListBoxItem } from "react-aria-components";

import { numberToOrdinalNumber, sortEntrantsAlphabetically } from "@lib/misc";

import { Chart } from "./chart";

import { AllEntrants, Round } from "@custom-types/game-types";

import styles from "@components/stats/stats.module.scss";
import dropDownStyles from "@components/dropdown/react-aria-dropdown.module.scss";

interface Props {
  allEntrants: AllEntrants;
  lastRound: Round | null;
}

export const EntrantPredictions = ({ allEntrants, lastRound }: Props) => {
  const entrantTypeArr = Object.keys(allEntrants);
  const initialEntrantType = entrantTypeArr[0];

  const [selectedEntrantType, setSelectedEntrantType] =
    useState(initialEntrantType);
  const selectedEntrants = sortEntrantsAlphabetically(
    Object.values(allEntrants[selectedEntrantType])
  );
  const [selectedEntrant, setSelectedEntrant] = useState(selectedEntrants[0]);

  /**If the entrantType is changed, update the entrantType state and set the selectedEntrant to the first entrant under that entrantType */
  const changeEntrantTypeHandler = (newValue: string) => {
    if (newValue !== selectedEntrantType) setSelectedEntrantType(newValue);
    setSelectedEntrant(
      sortEntrantsAlphabetically(Object.values(allEntrants[newValue]))[0]
    );
  };

  const changeEntrantHandler = (newValue: string) => {
    if (newValue !== selectedEntrant.sName) {
      const newEntrant = selectedEntrants.find(
        (entrant) => entrant.sName === newValue
      );
      if (newEntrant) setSelectedEntrant(newEntrant);
    }
  };

  return (
    <div>
      <div className={styles.inputs}>
        {entrantTypeArr.length !== 1 && (
          <ReactAriaDropdown
            defaultKey={entrantTypeArr[0]}
            items={entrantTypeArr}
            labelText="Entrant Type"
            classNames={dropDownStyles.margin_bottom}
            onSelectionChangeFn={changeEntrantTypeHandler}
            showLabelElement={true}>
            {entrantTypeArr.map((entrantType) => (
              <ListBoxItem
                id={entrantType}
                key={entrantType}
                className={({ isSelected }) =>
                  `${dropDownStyles.listBoxItem} ${
                    isSelected ? dropDownStyles.selected : ""
                  }`
                }>
                {entrantType.charAt(0).toUpperCase() + entrantType.slice(1)}
              </ListBoxItem>
            ))}
          </ReactAriaDropdown>
        )}
        <ReactAriaDropdown
          defaultKey={selectedEntrants[0].sName}
          items={selectedEntrants}
          labelText={
            selectedEntrantType.charAt(0).toUpperCase() +
            selectedEntrantType.slice(1, selectedEntrantType.length)
          }
          classNames={dropDownStyles.margin_bottom}
          onSelectionChangeFn={changeEntrantHandler}
          showLabelElement={true}>
          {selectedEntrants.map((entrant) => (
            <ListBoxItem
              id={entrant.sName}
              key={entrant.sName}
              className={({ isSelected }) =>
                `${dropDownStyles.listBoxItem} ${
                  isSelected ? dropDownStyles.selected : ""
                }`
              }>
              {entrant.name.charAt(0).toUpperCase() + entrant.name.slice(1)}
            </ListBoxItem>
          ))}
        </ReactAriaDropdown>
      </div>
      <div className={styles.chart}>
        <Chart entrant={JSON.parse(JSON.stringify(selectedEntrant))} />
      </div>
      {lastRound ? (
        <p style={{ textAlign: "center" }}>
          {`In the final standings, ${
            selectedEntrant.name
          } finished ${numberToOrdinalNumber(
            lastRound.standings[selectedEntrantType].indexOf(
              selectedEntrant.sName
            ) + 1
          )}.`}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};
