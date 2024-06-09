import Link from "next/link";

import styles from "@components/header/header.module.scss";

interface Props {
  type: "header" | "footer";
}

export const SecondaryMenu = ({ type }: Props) => (
  <nav
    className={`${styles.secondary_menu} ${
      type === "header"
        ? styles.secondary_menu__header
        : styles.secondary_menu__footer
    }`}>
    {type === "header" ? <hr /> : ""}
    <Link href="/terms-of-service">Terms of Service</Link>
    <Link href="/privacy-policy">Privacy Policy</Link>
    <Link href="/attribution">Attribution</Link>
    {type === "footer" ? (
      <a href="mailto:predictthestandings@protonmail.com">
        predictthestandings@protonmail.com
      </a>
    ) : (
      ""
    )}
  </nav>
);
