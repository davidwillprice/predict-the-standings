import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import RedditProvider from "next-auth/providers/reddit";
import TwitterProvider from "next-auth/providers/twitter";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import type { Adapter } from "next-auth/adapters";
import { pool } from "@lib/db";

export const authOptions = {
  //debug: true,
  adapter: PostgresAdapter(pool) as Adapter,
  callbacks: {
    async session({
      session,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      session.user.id = user.id;
      return session;
    },
  },
  providers: [
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
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID as string,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID as string,
      clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};
