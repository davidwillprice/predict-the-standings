import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayName: string;
      lastDisplayNameSubmissionDate: number;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    displayName: string;
    lastDisplayNameSubmission: number;
  }
}
