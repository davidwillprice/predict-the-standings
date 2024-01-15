import type { Metadata } from "next";
import Header from "./ui/header";
import { SessionProvider } from "@app/components/next-auth-provider";

import { Inter } from "next/font/google";
import "./ui/styles/globals.scss";
import styles from "./ui/styles/layout.module.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Predict The Standings",
  description: "Compete to predict the final tables for various sports",
  /**
   * @todo Add proper open graph social media card images
   */
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <div className={styles.content_container}>
            <main className={styles.main}>{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
