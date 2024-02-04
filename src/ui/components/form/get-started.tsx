"use client";

import { useState } from "react";

import { submitDisplayName } from "@lib/form-server-actions";
import { validateDisplayName } from "@lib/form-functions";

import styles from "@components/form/form.module.scss";
import btnStyles from "@components/button/button.module.scss";

interface Props {
  initialDisplayName: string;
}

export const GetStartedForm = ({ initialDisplayName }: Props) => {
  /**@todo Add front end and back end validation on the new display name*/
  /**@todo Must not already exist*/
  /**@todo Don't pick something disruptive or offensive*/
  /**@todo Sanitise data on front and back end*/
  /**@todo If they haven't submitted a valid display name, redirect them from the prediction pages until they have*/

  const [displayNameErrorArr, setDisplayNameErrorArr] = useState(
    validateDisplayName(initialDisplayName)
  );

  const handleDisplayNameChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const newDisplayName = event.currentTarget.value;
    setDisplayNameErrorArr(validateDisplayName(newDisplayName));
  };

  return (
    <>
      <form className={styles.form} action={submitDisplayName}>
        <div className={styles.input_container}>
          <label htmlFor="displayName">Display Name:</label>
          <input
            required
            pattern="^[a-zA-Z0-9_]*$"
            id="displayName"
            type="displayName"
            name="displayName"
            onChange={handleDisplayNameChange}
            defaultValue={initialDisplayName}
          />
        </div>
        {displayNameErrorArr.length > 0 ? (
          <ul className={styles.rules}>
            {displayNameErrorArr.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : (
          ""
        )}
        <div>
          <button
            className={btnStyles.button}
            type="submit"
            disabled={displayNameErrorArr.length > 0 ? true : false}>
            Submit Display Name
          </button>
        </div>
      </form>
    </>
  );
};
