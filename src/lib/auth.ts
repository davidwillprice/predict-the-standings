import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import PatreonProvider from "next-auth/providers/patreon";
import RedditProvider from "next-auth/providers/reddit";
import SpotifyProvider from "next-auth/providers/spotify";
import TwitterProvider from "next-auth/providers/twitter";
import { NextAuthOptions } from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import type { Adapter } from "next-auth/adapters";
import { pool } from "@lib/db";

export const authOptions: NextAuthOptions = {
  //debug: true,
  adapter: PostgresAdapter(pool) as Adapter,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      /**If user exists then the account has just been created and its data should be merged into the token */
      if (user)
        return {
          ...token,
          id: user.id,
          displayName: user.display_name,
        };

      /**useSession().update() has been triggered so merge the token with the new passed data */
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return { ...token };
    },
    async session({ session, token }) {
      /**Along with the usual session data, add these custom properties into the session so they can be obtained by getServerSession() and useSession() */
      session.user.id = token.id;
      session.user.displayName = token.displayName;
      session.user.lastDisplayNameSubmissionDate =
        token.lastDisplayNameSubmissionDate;
      //console.log(session);
      return session;
    },
  },
  /**@todo return updated information to get rid of unwanted passed information https://next-auth.js.org/configuration/providers/oauth#override-default-options */
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID as string,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    // InstagramProvider({
    //   clientId: process.env.INSTAGRAM_CLIENT_ID as string,
    //   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // PatreonProvider({
    //   clientId: process.env.PATREON_IDT as string,
    //   clientSecret: process.env.PATREON_SECRETT as string,
    // }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID as string,
      clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    // SpotifyProvider({
    //   clientId: process.env.SPOTIFY_CLIENT_ID as string,
    //   clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    // }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
