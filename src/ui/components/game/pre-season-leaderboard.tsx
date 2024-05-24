import styles from "@components/game/leaderboard.module.scss";

export const PreseasonLeaderboard = () => {
  const dummyRows = 10;
  return (
    <div>
      <table className={styles.leaderboard}>
        <thead>
          <tr>
            <th className={styles.position}>Pos</th>
            <th aria-label="Position change header"></th>
            <th>Name</th>
            <th>Accuracy</th>
            <th className={styles.perfect_positions}>Perfect Predictions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(dummyRows)].map((_, index) => (
            <tr key={index} className={styles.table_row}>
              <td className={styles.position}>{index + 1}</td>
              <td className={`${styles.position_diff} ${styles.no_change}`}>
                <i />
              </td>
              <td className={styles.name_cell}></td>
              <td></td>
              <td className={styles.perfect_positions}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
