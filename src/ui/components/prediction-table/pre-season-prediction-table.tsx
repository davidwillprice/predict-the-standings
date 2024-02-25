import styles from "@components/prediction-table/prediction-table.module.scss";

export const PreSeasonPredictionTable = () => {
  const dummyRows = 20;

  return (
    <div className={styles.prediction_table}>
      <table>
        <tbody>
          {[...Array(dummyRows)].map((_, index) => (
            <tr key={index} className={styles.table_row}>
              <td>{index + 1}</td>
              <td>
                <span className={`${styles.flair}`}></span>
              </td>
              <td>
                <span className={styles.name}></span>
                <span className={styles.sName}></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
