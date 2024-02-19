import { getServerSession } from "next-auth/next";

import { authOptions } from "@lib/auth";

import { MainNav } from "@components/header/main-nav";
import HeaderLink from "@components/header/header-link";
import { SecondaryMenu } from "@components/header/secondary-menu";

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
      <SecondaryMenu type={"header"} />
    </header>
  );
};
export default Header;
