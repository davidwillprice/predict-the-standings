"use client";

import { Button } from "@components/button/button";

import styles from "@components/form/form.module.scss";

interface Props {
  initialDisplayName: string;
}

export const GetStartedForm = ({ initialDisplayName }: Props) => {
  const submissionHandler = () => {
    console.log("Test");
  };
  /**@todo If they are a Google user, have a display name field placeholder equal to the first part of their email address like davidwillprice*/
  /**@todo Add front end and back end validation on the new display name*/
  /**@todo Minimum characters 3?*/
  /**@todo Max characters 12?*/
  /**@todo Only contain alphanumeric characters, and underscores (_)*/
  /**@todo The first character of the username must be an alphabetic character*/
  /**@todo Must not already exist*/
  /**@todo Don't pick something disruptive or offensive*/
  /**@todo Sanitise data on front and back end*/
  /**@todo If they haven't submitted a valid display name, redirect them from the prediction pages until they have*/
  /**@todo Better warning about the risks of submitting personal information?*/
  return (
    <>
      <form className={styles.form}>
        <div className={styles.input_container}>
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="displayName"
            name="displayName"
            value={initialDisplayName}
          />
        </div>
        <ul className={styles.rules}>
          <li>Use a minimum of 3 characters.</li>
          <li>Use a maximum of 12 characters.</li>
          <li>Only use alphanumeric characters, and underscores (_).</li>
          <li>The first character must be an alphabetic character.</li>
          <li>Don&apos;t choose something disruptive or offensive.</li>
        </ul>
      </form>
      <hr />
      <div className={styles.formBtns}>
        <Button onClick={submissionHandler}>Submit Display Name</Button>{" "}
      </div>
    </>
  );
};
