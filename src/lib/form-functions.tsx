type validationErrorArr = string[];
export const validateDisplayName = (
  displayName: string
): validationErrorArr => {
  const validationErrors: validationErrorArr = [];

  if (typeof displayName !== "string") {
    validationErrors.push("Unknown error");
  }

  const bannedDisplayNames = ["average"];
  if (bannedDisplayNames.includes(displayName.toLocaleLowerCase())) {
    validationErrors.push(`Display name '${displayName}' already exists`);
  }

  if (displayName.length < 3)
    validationErrors.push("Use a minimum of 3 characters");

  if (displayName.length > 14)
    validationErrors.push("Use a maximum of 14 characters");

  if (!/^[a-zA-Z]$/.test(displayName[0]))
    validationErrors.push(
      "The first character must be an alphabetic character"
    );

  if (!/^[a-zA-Z0-9_]+$/.test(displayName))
    validationErrors.push(
      "Only use alphanumeric characters, and underscores (_)"
    );

  return validationErrors;
};
