"use client";

import Image from "next/image";

import predictionTableStyles from "@components/prediction-table/prediction-table.module.scss";

type Props = {
  name: string;
  sName: string;
};

export const FlagCell = ({ name, sName }: Props) => {
  return (
    <td className={predictionTableStyles.flag_cell}>
      <div className={predictionTableStyles.flag_con}>
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
