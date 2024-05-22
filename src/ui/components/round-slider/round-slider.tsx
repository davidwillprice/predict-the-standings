"use client";
import { useState } from "react";

import styles from "@components/round-slider/round-slider.module.scss";
import { Round } from "@custom-types/game-types";

interface Props {
  addDebouncingState: Function;
  changeRound: Function;
  initialRoundIndex: number;
  rounds: Round[];
}

export const RoundSlider = ({
  addDebouncingState,
  changeRound,
  initialRoundIndex,
  rounds,
}: Props) => {
  const noOfRounds = rounds.length;
  const [sliderValue, setSliderValue] = useState(initialRoundIndex);
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    /**Change leaderboard to loading skeleton UI */
    addDebouncingState();
    /**Update RoundSlider states so the updated track name can be immediately shown */
    setSliderValue(+event.target.value);
    /**Change round within GameContainer but with debounce */
    changeRound(+event.target.value);
  };

  return (
    <div
      className={styles.round_footer}
      style={noOfRounds < 5 ? { maxWidth: "400px" } : {}}>
      <div className={styles.con}>
        {/**@todo Add arrow buttons to let people change the round without having to use the slider */}
        {/**@todo Compare slider to Aria React's slider and W3 slider pattern to see what improvements can be made or possibly just implement the React Aria solution */}
        {/**@todo! 'Track-name' needs to be updated for football */}
        <h2>
          Round {sliderValue + 1}:{" "}
          <span id="track-name">{rounds[sliderValue].trackName}</span>
        </h2>
        {noOfRounds > 1 && (
          <div className={styles.slider_footer}>
            <div className={styles.notch_con}>
              {Array.from({ length: noOfRounds }, (_, index) => (
                <div className={styles.notch} key={index} />
              ))}
            </div>
            <input
              onChange={(event) => onChangeHandler(event)}
              aria-label="Round slider"
              type="range"
              min="0"
              max={noOfRounds - 1}
              className={styles.slider}
              defaultValue={initialRoundIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
};
