import Image from "next/image";

import predictionTableStyles from "@components/prediction-table/prediction-table.module.scss";

import { Entrant } from "@custom-types/game-types";

type Props = {
  country: Entrant;
};

export const FlagCell = ({ country }: Props) => {
  return (
    <td>
      <div className={predictionTableStyles.flag_cell}>
        <Image
          draggable="false"
          src={require(`../../../images/flags/${country.sName}-flag.png`)}
          height={17}
          alt={`${country.name} flag`}
        />
      </div>
    </td>
  );
};
