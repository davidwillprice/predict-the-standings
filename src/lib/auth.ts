import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@lib/mongodb";
import type { Adapter } from "next-auth/adapters";
import authConfig from "@lib/auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  //debug: true,
  ...authConfig,
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
  /**@todo return updated information to get rid of unwanted passed information https://next-auth.js.org/configuration/providers/oauth#override-default-options like profile pictures */
});
