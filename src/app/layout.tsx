import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rich music",
  description: "Rich music, vinilos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="https://images.emojiterra.com/twitter/v14.0/512px/1f3a7.png"
          type="image/png"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
