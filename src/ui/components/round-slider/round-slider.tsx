import styles from "@components/round-slider/round-slider.module.scss";

interface Props {
  selectedRound: number;
  trackName: string;
  noOfRounds: number;
  changeRound: Function;
}

export const RoundSlider = ({
  selectedRound,
  trackName,
  noOfRounds,
  changeRound,
}: Props) => {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeRound(+event.target.value);
  };

  return (
    <div
      className={styles.round_footer}
      style={noOfRounds < 5 ? { maxWidth: "400px" } : {}}>
      <div className={styles.con}>
        <h2>
          Round {selectedRound + 1} :<span id="track-name"> {trackName}</span>
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
              value={selectedRound}
            />
          </div>
        )}
      </div>
    </div>
  );
};
