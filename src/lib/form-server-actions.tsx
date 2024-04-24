"use server";

import { validateDisplayName } from "@lib/form-functions";
import { submitDisplayNameQuery } from "@lib/db-functions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/auth";

export const submitDisplayName = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (session == null) return;

  const userId = session.user.id;

  const displayName = formData.get("displayName");

  /**Throw error if the display name is somehow not a string */
  if (typeof displayName !== "string") throw new Error(`Error: Unknown`);

  const validationErrorArr = validateDisplayName(displayName);

  /**User has submitted a display name that should have failed front-end validation  */
  if (validationErrorArr.length !== 0) throw new Error(`Error: Unknown`);

  try {
    await submitDisplayNameQuery(displayName, userId);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};
