import NextAuth, { User } from "next-auth";
import Discord, { DiscordProfile } from "next-auth/providers/discord";
import Github, { GitHubProfile } from "next-auth/providers/github";
import Google, { GoogleProfile } from "next-auth/providers/google";
import Reddit from "next-auth/providers/reddit";
import Twitter, { TwitterProfile } from "next-auth/providers/twitter";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@lib/mongodb";
import type { Adapter } from "next-auth/adapters";

export const { auth, handlers, signIn, signOut } = NextAuth({
  //debug: true,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      /**If user exists then the account has just been created and its data should be merged into the token */
      if (user)
        return {
          ...token,
          id: user.id,
          displayName: user.displayName,
          lastDisplayNameSubmissionDate: user.lastDisplayNameSubmission,
          predictionsMadeFor: user.predictionsMadeFor,
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
      session.user.predictionsMadeFor = token.predictionsMadeFor;
      return session;
    },
  },
  providers: [
    /**@todo! Add email provider in case I hit limits on the others */
    Discord({
      allowDangerousEmailAccountLinking: true,
      /**Manually state the values I want to set their discord username to their PTS display name */
      profile: (profile: DiscordProfile): User => {
        return {
          id: profile.id,
          email: profile.email,
          displayName: profile.username,
          lastDisplayNameSubmission: undefined,
          predictionsMadeFor: {},
        };
      },
    }),
    // Facebook({
    //   allowDangerousEmailAccountLinking: true,
    // }),
    Github({
      allowDangerousEmailAccountLinking: true,
      /**Manually state the values I want to set their login to their PTS display name */
      profile(profile: GitHubProfile) {
        return {
          id: String(profile.id),
          email: profile.email,
          displayName: profile.login,
          lastDisplayNameSubmission: undefined,
          predictionsMadeFor: {},
        };
      },
    }),
    Google<GoogleProfile>({
      allowDangerousEmailAccountLinking: true,
      /**Manually state the values I want to avoid obtaining unnecessary data like people's name and image */
      profile(profile) {
        return {
          id: profile.id,
          email: profile.email,
          displayName: profile.displayName,
          lastDisplayNameSubmission: profile.lastDisplayNameSubmission,
          predictionsMadeFor: {},
        };
      },
    }),
    // Instagram({
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // Patreon(),
    Reddit({
      allowDangerousEmailAccountLinking: true,
      /**Manually state the values I want to set their discord username to their PTS display name */
      profile: (profile): User => {
        return {
          id: profile.id,
          email: profile.email,
          displayName: profile.username,
          lastDisplayNameSubmission: undefined,
          predictionsMadeFor: {},
        };
      },
    }),
    // Spotify(),
    Twitter({
      allowDangerousEmailAccountLinking: true,
      /**Manually state the values I want to avoid obtaining people's name and image */
      profile: (profile: TwitterProfile): User => {
        return {
          id: profile.data.id,
          email: profile.data?.email,
          displayName: profile.data?.username,
          lastDisplayNameSubmission: undefined,
          predictionsMadeFor: {},
        };
      },
    }),
  ],
});
