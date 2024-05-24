"use client";

import Image from "next/image";

import styles from "@components/entrant-table/entrant-table.module.scss";

type Props = {
  name: string;
  sName: string;
};

export const FlagCell = ({ name, sName }: Props) => {
  return (
    <td className={styles.flag_cell}>
      <div className={styles.flag_con}>
        <Image
          draggable="false"
          src={require(`../../../images/flags/${sName}-flag.png`)}
          height={17}
          alt={`${name} flag`}
        />
      </div>
    </td>
  );
};
