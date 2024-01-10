import GoogleProvider from "next-auth/providers/google";
import RedditProvider from "next-auth/providers/reddit";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import type { Adapter } from "next-auth/adapters";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST as string,
  user: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  database: process.env.POSTGRES_DATABASE as string,
  max: 20,
  ssl: true,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const authOptions = {
  debug: true,
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
      //console.log(session, token, user);

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
