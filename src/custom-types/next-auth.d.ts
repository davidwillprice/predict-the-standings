import NextAuth from "next-auth";
import { UserDataFromSession } from "./misc";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayName: string;
      lastDisplayNameSubmissionDate: number;
      predictionsMadeFor: { [competition: string]: Set<string> };
    } & DefaultSession["user"];
  }
  interface User extends UserDataFromSession {}
}
