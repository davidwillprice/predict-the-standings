import Discord from "next-auth/providers/discord";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Reddit from "next-auth/providers/reddit";
import Twitter from "next-auth/providers/twitter";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Discord({
      allowDangerousEmailAccountLinking: true,
    }),
    // Facebook({
    //   allowDangerousEmailAccountLinking: true,
    // }),
    Github({
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    // Instagram({
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // Patreon(),
    Reddit({
      allowDangerousEmailAccountLinking: true,
    }),
    // Spotify(),
    Twitter({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
