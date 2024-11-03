import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rich Music",
  description: "Vinyls I want",
  authors: { name: "Brandon Porcel", url: "https://github.com/brandonporcel?" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rich-music.vercel.app/",
    title: "Rich Music",
    description: "Vinyls I want",
    siteName: "Keep Code",
    images: [
      {
        url: "https://rich-music.vercel.app//og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rich Music",
    description: "Vinyls I want",
    images: [
      {
        url: "https://keep-code.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: [
    {
      type: "favicon",
      url: "favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
