import styles from "@components/game/leaderboard.module.scss";

export const LeaderboardSkeleton = () => (
  <div className={styles.skeleton_table} aria-hidden="true">
    {Array.from(Array(8).keys()).map((_, index) => (
      <div className={styles.skeleton_table__row} key={index}></div>
    ))}
  </div>
);
