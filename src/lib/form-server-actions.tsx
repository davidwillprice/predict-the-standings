"use server";

import { validateDisplayName } from "@lib/form-functions";

export const submitDisplayName = async (formData: FormData) => {
  const displayName = formData.get("displayName");
  if (
    typeof displayName === "string" &&
    validateDisplayName(displayName).length === 0
  )
    console.log(`Submitting ${displayName} as a display name`);
  else {
    console.log("Invalid display name");
  }
};
