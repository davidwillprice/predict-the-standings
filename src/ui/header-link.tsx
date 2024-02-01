import Link from "next/link";
import { usePathname } from "next/navigation";

import Icon from "@svgs/icons/sq-icon";

import styles from "@styles/header.module.scss";

import type { Props as IconProps } from "@svgs/icons/sq-icon";

interface Props {
  children: string;
  href: string;
  icon: IconProps["type"];
}

const HeaderLink = ({ children, href, icon }: Props) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={`${styles.link} ${
        pathname === href ? styles.link_active : ""
      }`}>
      <div className={styles.icon}>
        <Icon type={icon} strokeWidth={2} />
      </div>
      {children}
    </Link>
  );
};
export default HeaderLink;
