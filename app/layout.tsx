import type { Metadata } from "next";
import { SessionProvider } from "@lib/next-auth-provider";
import { Providers } from "./providers";
import { Roboto } from "next/font/google";

import Header from "@components/header/header";
import { SecondaryMenu } from "@components/header/secondary-menu";

import "@styles/globals.scss";
import styles from "@styles/layout.module.scss";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

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
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <SessionProvider>
            <Header />
            <div className={styles.content_container}>
              <main className={styles.main}>{children}</main>
            </div>
            <SecondaryMenu type="footer" />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
