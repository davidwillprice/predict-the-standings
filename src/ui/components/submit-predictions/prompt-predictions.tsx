import Link from "next/link";

import Icon from "@svgs/icons/sq-icon";

import btnConStyles from "@components/button/button-containers.module.scss";
import btnStyles from "@components/button/button.module.scss";

interface Props {
  isSignedIn: boolean;
  predictionFreezeTime: Date;
}

export const PromptPredictions = ({
  isSignedIn,
  predictionFreezeTime,
}: Props) => {
  return predictionFreezeTime.getTime() > new Date().getTime() ? (
    <>
      <hr />
      <div className={btnConStyles.single}>
        <Link href="/formula-1/predict" className={btnStyles.button}>
          <Icon strokeWidth={2} type="listBullet" />
          {isSignedIn ? "Edit Your Predictions" : "Predict The Standings"}
        </Link>
      </div>
    </>
  ) : (
    ""
  );
};
