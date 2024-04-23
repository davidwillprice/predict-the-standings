"use client";

import { FeedbackContainer } from "@components/feedback-container/feedback-container";
import { Button } from "@components/button/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <FeedbackContainer iconType={"error"}>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <div style={{ maxWidth: "200px" }}>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </FeedbackContainer>
  );
}
