import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WI Space Program",
  description: "Official site of WI Space Program.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="px-6 pt-10 pb-6 max-w-5xl mx-auto">
          <Link href="/" aria-label="WI Space Program — home" className="block">
            <Image
              src="/logos/horizontal-wordmark.svg"
              alt="WI Space Program"
              width={600}
              height={120}
              className="w-full h-auto dark:invert"
              priority
            />
          </Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
