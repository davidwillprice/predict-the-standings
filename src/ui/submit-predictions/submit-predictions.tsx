"use client";

import { useEffect, useState } from "react";

import { submitPredictions } from "@lib/submit-predictions";
import { Button } from "@ui/button";

/**@todo Need to add error catching with warnings/confirmation that a submission is saved */
/**@todo Need to limit database calls - Add lock for 10 seconds? - Add state to check if the table is the same as it was last submitted */
/**@todo Need to lock button after season start*/

export const SubmitPredictions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted && document) {
    const predictionTable = document.getElementById("prediction-table");
    if (predictionTable) {
      return (
        <Button
          onClick={async () => {
            await submitPredictions(predictionTable.dataset.entrantOrder);
          }}>
          Submit Predictions
        </Button>
      );
    }
  }
};
