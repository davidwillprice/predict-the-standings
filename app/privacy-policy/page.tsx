import { Metadata } from "next";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

import styles from "@styles/cookies-table.module.scss";

export const metadata: Metadata = {
  title: "Privacy Policy | Predict The Standings",
};

export default function Page() {
  return (
    <>
      <PanelHeading>
        <h2>Privacy Policy</h2>
      </PanelHeading>
      <Panel>
        <section>
          <p>
            Predict The Standings (&apos;we,&apos; &apos;us,&apos; or
            &apos;our&apos;) is committed to safeguarding your privacy and
            complying with the General Data Protection Regulation (GDPR). This
            Privacy Policy outlines how we collect, use, disclose, and protect
            your personal information when you access or use our website.
          </p>
        </section>
        <hr />
        <section>
          <h3>1. Information We Collect</h3>
          <p>
            We use{" "}
            <a href="https://authjs.dev/" target="_blank">
              Auth.js
            </a>{" "}
            to allow you to sign in with your favorite pre-existing logins while
            minimising the personal data we store.
          </p>
          <p>
            When you log in using a third party&apos;s OAuth, we rely on their
            authentication system to verify your identity. We do not store any
            account passwords.
          </p>
          <p>
            If you log in using Discord&apos;s OAuth, we may collect the
            following information:
          </p>
          <ul>
            <li>
              Your Discord account information, including your username, avatar,
              email address, and banner.
            </li>
          </ul>
          <p>
            If you log in using Google&apos;s OAuth, we may collect the
            following information:
          </p>
          <ul>
            <li>
              Your Google account information, including your name, email
              address, and profile picture.
            </li>
            <li>
              Any personal info you&apos;ve made publicly available on your
              Google account.
            </li>
          </ul>
          <p>
            If you log in using Twitter&apos;s OAuth, we may collect the
            following information:
          </p>
          <ul>
            <li>
              All the posts you can view, including posts from protected
              accounts.
            </li>
            <li>Account information including name and email address.</li>
          </ul>
          <p>
            If you log in using Reddit&apos;s OAuth, we may collect the
            following information:
          </p>
          <ul>
            <li>
              Your Reddit account username, email address (if provided to us by
              Reddit), and profile information.
            </li>
          </ul>
        </section>
        <hr />
        <section>
          <h3>2. How We Use Your Information</h3>
          <p>We use the information collected for the following purposes:</p>
          <ul>
            <li>To create and manage your user account.</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <p>We do not:</p>
          <ul>
            <li>
              Share our personal information to third parties outside those
              listed specifically in this Privacy Policy.
            </li>
            <li>
              Employ any sort of tracking or fingerprinting for analytics or
              advertising.
            </li>
          </ul>
        </section>
        <hr />
        <section>
          <h3>3. Your Rights</h3>
          <p>
            Under the GDPR, you have certain rights in relation to your personal
            data. These rights empower you to have more control and transparency
            over how your personal information is handled by data controllers
            like us. The main rights granted to individuals under the GDPR
            include:
          </p>
          <ul>
            <li>
              <strong>Right to Access (Article 15)</strong>: You have the right
              to obtain confirmation from us as to whether or not personal data
              concerning you is being processed, and, if so, you have the right
              to access that personal data.
            </li>
            <li>
              <strong>Right to Rectification (Article 16)</strong>: You can
              request the correction of inaccurate or incomplete personal data.
            </li>
            <li>
              <strong>
                Right to Erasure (Right to be Forgotten) (Article 17)
              </strong>
              : You have the right to request the deletion of your personal data
              under certain circumstances, such as when the data is no longer
              necessary for the purposes for which it was collected or when the
              individual withdraws consent.
            </li>
            <li>
              <strong>Right to Restriction of Processing (Article 18)</strong>:
              You can request the restriction of the processing of your personal
              data in certain situations, such as when the accuracy of the data
              is contested or when the processing is unlawful.
            </li>
            <li>
              <strong>Right to Data Portability (Article 20)</strong>: You have
              the right to receive your personal data in a structured, commonly
              used, and machine-readable format and have the right to transmit
              that data to another controller.
            </li>
            <li>
              <strong>Right to Object (Article 21)</strong>: You can object to
              the processing of your personal data, especially in cases where
              the processing is based on legitimate interests or is for direct
              marketing purposes.
            </li>
            <li>
              <strong>
                Rights Related to Automated Decision Making, including Profiling
                (Article 22)
              </strong>
              : You have the right not to be subject to decisions based solely
              on automated processing, including profiling, which produces legal
              effects concerning you or similarly significantly affecting you.
            </li>
            <li>
              <strong>Right to Withdraw Consent (Article 7)</strong>: Where
              processing is based on consent, you have the right to withdraw
              your consent at any time. This does not affect the lawfulness of
              processing based on consent before its withdrawal.
            </li>
          </ul>
          <p>
            To exercise these rights or if you have any questions about your
            data, please contact{" "}
            <a href="mailto:predictthestandings@protonmail.com">
              predictthestandings@protonmail.com
            </a>
            .
          </p>
        </section>
        <hr />
        <section>
          <h3>4. Data Storage and Security</h3>
          <p>
            We store your personal data in a Vercel database in Washington,
            D.C., USA.
          </p>
          <p>
            Learn about the protection and compliance measures Vercel takes to
            ensure the security of your data, including DDoS mitigation, SOC 2
            compliance and more on the{" "}
            <a href="https://vercel.com/docs/security" target="_blank">
              Vercel website
            </a>
            .
          </p>
          <p>Vercel also supports GDPR compliance meaning they:</p>
          <ul>
            <li>
              Implement and maintain appropriate technical and organisational
              security measures surrounding customer data.
            </li>
            <li>
              Notify their customers without undue delay of any data breaches.
            </li>
            <li>
              Impose similar data protection obligations on their sub-processors
              as they do for themselves.
            </li>
            <li>
              Respond to applicable{" "}
              <a
                href="https://vercel.com/legal/privacy-policy#eea"
                target="_blank">
                data subjects rights
              </a>
              , including requests for access, correction, and/or deletion of
              their personal data.
            </li>
            <li>
              Rely on the EU Standard Contractual Clauses and the UK Addendum as
              valid data transfer mechanisms when transferring personal data
              outside the EEA.
            </li>
          </ul>
        </section>
        <hr />
        <section>
          <h3>5. Cookies and Similar Technologies</h3>
          <p>
            Cookies are files with small amount of data which may include a
            unique identifier. Cookies are sent to your browser from a website
            and stored on your device.
          </p>
          <p>
            We only use strictly necessary 1st party cookies and JSON Web Tokens
            through Auth.js to allow you to log into and use the website. These
            include:
          </p>
          <div className={styles.con}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cookie ID</th>
                  <th>Type</th>
                  <th>Security</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>__Host-next-auth.csrf-token</td>
                  <td>Session</td>
                  <td>https</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>__Secure-next-auth.callback-url</td>
                  <td>Session</td>
                  <td>https</td>
                  <td>1 month</td>
                </tr>
                <tr>
                  <td>__Secure-next-auth.session-token</td>
                  <td>Session</td>
                  <td>https</td>
                  <td>Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <hr />
        <section>
          <h3>6. Data Retention</h3>
          <p>
            We retain your personal data for as long as necessary to fulfill the
            purposes outlined in this Privacy Policy, or as required by
            applicable laws.
          </p>
        </section>
        <hr />
        <section>
          <h3>7. Children&apos;s Privacy</h3>
          <p>
            Our website is not intended for children under the age of 13. We do
            not knowingly collect personal information from children.
          </p>
        </section>
        <hr />
        <section>
          <h3>8. Changes to this Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be effective when posted on this page, and we encourage you to
            review the Privacy Policy periodically.
          </p>
        </section>
        <hr />
        <section>
          <h3>9. Contact Us</h3>
          <p>
            If you have any questions or concerns about our Privacy Policy,
            please contact{" "}
            <a href="mailto:predictthestandings@protonmail.com">
              predictthestandings@protonmail.com
            </a>
            .
          </p>
        </section>
      </Panel>
    </>
  );
}
