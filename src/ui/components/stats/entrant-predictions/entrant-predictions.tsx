"use client";

import { useState } from "react";

import { sortEntrantsAlphabetically } from "@lib/misc";

import { Chart } from "./chart";
import { HeadToHead } from "@components/stats/entrant-predictions/head-to-head";

import { PredictionData } from "@custom-types/game-types";

import styles from "@components/stats/stats.module.scss";
import inputStyles from "@styles/select-input.module.scss";

interface Props {
  predictionData: PredictionData;
}

export const EntrantPredictions = ({ predictionData }: Props) => {
  const entrantData = predictionData.entrants;

  const entrantTypeArr = Object.keys(entrantData);
  const initialEntrantType = entrantTypeArr[0];

  const [selectedEntrantType, setSelectedEntrantType] =
    useState(initialEntrantType);
  const selectedEntrants = sortEntrantsAlphabetically(
    Object.values(entrantData[selectedEntrantType])
  );
  const [selectedEntrant, setSelectedEntrant] = useState(selectedEntrants[0]);

  /**If the entrantType is changed, update the entrantType state and set the selectedEntrant to the first entrant under that entrantType */
  const changeEntrantTypeHandler = (
    event: React.FormEvent<HTMLSelectElement>
  ) => {
    if (event.currentTarget.value !== selectedEntrantType)
      setSelectedEntrantType(event.currentTarget.value);
    setSelectedEntrant(
      sortEntrantsAlphabetically(
        Object.values(entrantData[event.currentTarget.value])
      )[0]
    );
  };

  const changeEntrantHandler = (event: React.FormEvent<HTMLSelectElement>) => {
    if (event.currentTarget.value !== selectedEntrant.sName) {
      const newEntrant = selectedEntrants.find(
        (entrant) => entrant.sName === event.currentTarget.value
      );
      if (newEntrant) setSelectedEntrant(newEntrant);
    }
  };

  return (
    <div>
      <div className={styles.inputs}>
        <label htmlFor="entrant-type">
          <small>Championship Type</small>
        </label>
        <select
          className={inputStyles.select_input}
          name="entrant-type"
          id="entrant-type"
          onChange={changeEntrantTypeHandler}>
          {entrantTypeArr.map((entrantType) => (
            <option key={entrantType} value={entrantType}>
              {entrantType.charAt(0).toUpperCase() + entrantType.slice(1)}
            </option>
          ))}
        </select>
        <label htmlFor="entrant">
          <small>
            {selectedEntrantType.charAt(0).toUpperCase() +
              selectedEntrantType.slice(1, selectedEntrantType.length - 1)}
          </small>
        </label>
        <select
          className={inputStyles.select_input}
          name="entrant"
          id="entrant"
          onChange={changeEntrantHandler}>
          {selectedEntrants.map((entrant) => (
            <option key={entrant.sName} value={entrant.sName}>
              {entrant.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.chart}>
        <Chart entrant={JSON.parse(JSON.stringify(selectedEntrant))} />
      </div>
      <HeadToHead
        teammates={predictionData.rounds[0].standings["driver"].filter(
          (driver) => driver.color === selectedEntrant.color
        )}
      />
    </div>
  );
};
