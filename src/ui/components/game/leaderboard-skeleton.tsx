import styles from "@components/game/leaderboard.module.scss";

type Props = {
  usersPerPage: number;
};

export const LeaderboardSkeleton = ({ usersPerPage }: Props) => (
  <div className={styles.skeleton_table} aria-hidden="true">
    {Array.from(Array(usersPerPage).keys()).map((_, index) => (
      <div className={styles.skeleton_table__row} key={index}></div>
    ))}
  </div>
);
