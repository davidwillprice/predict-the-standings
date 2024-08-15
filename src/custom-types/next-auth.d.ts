import NextAuth from "next-auth";
import { DBCollectionStr, UserDataFromSession } from "./misc";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayName: string;
      lastDisplayNameSubmissionDate: number;
      predictionsMadeFor: {
        [competition: string]: DBCollectionStr[];
      };
    } & DefaultSession["user"];
  }
  interface User extends UserDataFromSession {}
}
