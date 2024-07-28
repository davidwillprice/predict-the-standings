import { Metadata } from "next";
import Link from "next/link";
import { generateOgImgUrl } from "@lib/misc";

import { Panel } from "@components/panels/panel";
import { PanelHeading } from "@components/panels/panel-heading";

export const metadata: Metadata = {
  title: "Terms of Service | Predict The Standings",
  description:
    "By registering with the website, users agree to abide by the terms outlined in this terms of service",
  openGraph: {
    images: [
      {
        url: generateOgImgUrl("Terms of Service", "pl"),
        alt: "Page screenshot",
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <PanelHeading>
        <h2>Terms of Service</h2>
      </PanelHeading>
      <Panel>
        <section>
          <p>
            Predict The Standings (&apos;we,&apos; &apos;us,&apos; or
            &apos;our&apos;) is a non-commerical website for entertainment
            purposes only.
          </p>
          <p>
            By registering with the website, users agree to abide by the terms
            outlined in this terms of service.
          </p>
        </section>
        <hr />
        <section>
          <h3>Accounts</h3>
          <p>
            We use{" "}
            <a href="https://authjs.dev/" target="_blank">
              Auth.js
            </a>{" "}
            to allow users to sign in with their favorite pre-existing logins
            while minimising the personal data we store.
          </p>
          <p>
            When you log in using a third party&apos;s OAuth, we rely on their
            authentication system to verify your identity. We do not store any
            account passwords.
          </p>
          <p>
            Along with the data necessary for these OAuth systems, users can
            submit a display name and predictions for various competitions
            across multiple seasons.
          </p>
          <p>
            Users are encouraged to select a display name that isn&apos;t
            disruptive or discriminatory.
          </p>
          <p>Our website is not intended for children under the age of 13.</p>
        </section>
        <hr />
        <section>
          <h3>Intellectual Property</h3>
          <p>
            This website is unofficial and is not associated in any way with the
            Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE
            WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of
            Formula One Licensing B.V.
          </p>
          <p>
            This website is unofficial and is not associated in any way with
            Eurovision. Eurovision is a registered trademark of the EBU.
          </p>
        </section>
        <hr />
        <section>
          <h3>Privacy Policy</h3>
          <p>
            We are committed to safeguarding your privacy and complying with the
            General Data Protection Regulation (GDPR).
          </p>
          <p>
            For more information, please visit our{" "}
            <Link href="/privacy-policy">Privacy Policy</Link> page.
          </p>
        </section>
        <hr />
        <section>
          <h3>Termination of Accounts</h3>
          <p>
            Accounts maybe terminated due to a violation of these terms,
            inactivity, or at our discretion.
          </p>
        </section>
        <hr />
        <section>
          <h3>Updates to Terms</h3>
          <p>
            We reserve the right to modify, amend, or update these Terms of
            Service at our discretion. Any changes will be effective immediately
            upon posting the revised Terms on the website. It is your
            responsibility to regularly review these Terms, and continued use of
            the website after any modifications constitute your acceptance of
            the revised Terms.
          </p>
        </section>
        <hr />
        <section>
          <h3>Governing Law and Jurisdiction</h3>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of England.
          </p>
          <p>
            Any dispute arising out of or in connection with these Terms of
            Service, including any question regarding their existence, validity,
            or termination, shall be subject to the exclusive jurisdiction of
            the courts of England.
          </p>
        </section>
        <hr />
        <section>
          <h3>Contact Us</h3>
          <p>
            If you have any questions or concerns about our Terms of Service,
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
