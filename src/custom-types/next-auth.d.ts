import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayName: string;
      lastDisplayNameSubmissionDate: Date;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    display_name: string;
    lastDisplayNameSubmissionDate: Date;
  }
}
