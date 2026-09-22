import type { Metadata } from "next";
import { Hind_Siliguri, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-bengali",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voter Information Management Dashboard | Election Commission",
  description: "Citizen voter registry and records management system with real-time cloud search and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
