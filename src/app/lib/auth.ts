import GoogleProvider from "next-auth/providers/google";
import RedditProvider from "next-auth/providers/reddit";
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
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      // Send properties to the client, like an access_token and user id from a provider.
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID as string,
      clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
    }),
  ],
};
