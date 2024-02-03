import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@lib/auth";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

import styles from "@styles/account.module.scss";

/**@todo Add ability to change display name, but limit changes to once a day or something to save DB calls */

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    return redirect("/login");
  }

  const name = session?.user?.name as string;
  const email = session?.user?.email;

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
  /**@todo Better warning about the risks of submitting personal information*/
  return (
    <>
      <PanelHeading>
        <h2>Get Started</h2>
      </PanelHeading>
      <Panel>
        <p>
          Before you submit any predictions, please choose a display name which
          will appear publically next to your predictions on the leaderboard.
        </p>
        <div className={styles.account}>
          <div className={styles.input_container}>
            <label htmlFor="name">Display Name</label>
            <input id="name" type="name" name="name" value={name} />
          </div>
        </div>
        {/**@todo Once they've submitted a value display name, show links to currently running competitions, other have a message of something like 'Come back soon' */}
      </Panel>
    </>
  );
}
