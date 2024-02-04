"use server";

import { validateDisplayName } from "@lib/form-functions";
import { submitDisplayNameQuery } from "@lib/db-functions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/auth";

export const submitDisplayName = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return;
  }
  const userId = session.user.id;

  const displayName = formData.get("displayName");
  if (
    typeof displayName === "string" &&
    validateDisplayName(displayName).length === 0
  ) {
    try {
      const res = await submitDisplayNameQuery(displayName, userId);
      if (res.length === 0) {
        // No rows were updated, indicating a duplicate displayname
        throw new Error(`Display name '${displayName}' already exists.`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return error.message;
      }
    }
  } else {
    throw new Error(`Display name '${displayName}' already exists.`);
  }
};
