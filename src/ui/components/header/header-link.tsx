"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import Icon from "@svgs/icons/sq-icon";

import styles from "@components/header/header.module.scss";

import type { Props as IconProps } from "@svgs/icons/sq-icon";

interface Props {
  children: string;
  customLinkActiveOptions?: {
    href: string;
    includeQuery: boolean;
    query: string[];
  };
  href: string;
  icon: IconProps["type"];
}

const HeaderLink = ({
  children,
  customLinkActiveOptions,
  href,
  icon,
}: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**If the HeaderLink has specific linkActive criteria, check whether those are met rather than just looking at the href */
  const isLinkActive = (): boolean => {
    if (customLinkActiveOptions) {
      const hasQueryValue =
        searchParams.get(customLinkActiveOptions.query[0]) ===
        customLinkActiveOptions.query[1];
      return (
        pathname === customLinkActiveOptions.href &&
        hasQueryValue === customLinkActiveOptions.includeQuery
      );
    } else {
      return pathname === href;
    }
  };

  return (
    <Link
      href={href}
      className={`${styles.link} ${isLinkActive() ? styles.link_active : ""}`}>
      <div className={styles.icon}>
        <Icon type={icon} strokeWidth={2} />
      </div>
      {children}
    </Link>
  );
};
export default HeaderLink;
