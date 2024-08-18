import NextAuth from "next-auth";
import { UserDataFromSession } from "./misc";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayName: string;
      lastDisplayNameSubmissionDate: number;
      /**Former is new type from 8/2024 where the userId is used for all gamedata _id so I just need the seasonStr, the latter is the old type which some people might still have if they haven't logged out/in since then */
      predictionsMadeFor: {
        [competition: string]: string[] | { season: string; _id: string }[];
      };
    } & DefaultSession["user"];
  }
  interface User extends UserDataFromSession {}
}
