import { getServerSession } from "next-auth/next";

import { authOptions } from "@lib/auth";

import Link from "next/link";

import { MainNav } from "@components/header/main-nav";
import HeaderLink from "@components/header/header-link";

import styles from "@components/header/header.module.scss";

const Header = async () => {
  const session = await getServerSession(authOptions);
  const profileLink = session ? (
    <HeaderLink href="/profile" icon="profile">
      Profile
    </HeaderLink>
  ) : (
    <HeaderLink href="/login" icon="login">
      Login
    </HeaderLink>
  );
  return (
    <header className={styles.header}>
      <MainNav>{profileLink}</MainNav>
      <nav className={styles.secondary_menu}>
        <hr />
        <div>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>
      </nav>
    </header>
  );
};
export default Header;
