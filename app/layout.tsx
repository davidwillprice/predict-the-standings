import type { Metadata } from "next";
import { SessionProvider } from "@lib/next-auth-provider";
import { Providers } from "./providers";
import { generateOgImgUrl } from "@lib/misc";

import { Roboto } from "next/font/google";

import Header from "@components/header/header";
import { SecondaryMenu } from "@components/header/secondary-menu";
import { Background } from "@components/background/background";

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
  metadataBase: process.env.AUTH_URL
    ? new URL(process.env.AUTH_URL)
    : undefined,
  openGraph: {
    images: [
      {
        url: generateOgImgUrl(),
        alt: "Page screenshot",
      },
    ],
  },
};
/**@todo Randomly getting 500 error on first load some session issue? */
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
            <Background />
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
