import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";

import { Providers } from "./providers";
import clsx from "clsx";
import { Layout } from "./_components/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parallel Story Six",
  description: "Next Generation of Story",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className="size-full">
      <body className={clsx("size-full", inter.className)}>
        <Providers>
          <Layout>{props.children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
