import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LiveEventsProvider } from "@/lib/liveEvents";
import { LiveEventTicker } from "@/components/LiveEventTicker";
import { GlobalStateProvider } from "@/lib/globalState";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#ea580c",
};

export const metadata: Metadata = {
  title: "Skill Sync — Longitudinal Skilling Outcomes & Impact Tracker | SIH 2026",
  description: "Government of Maharashtra (MSIS / Dept of Skills) Longitudinal Skilling Tracker, Multi-channel Follow-ups, and Triangulation Platform.",
  applicationName: "Skill Sync",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Skill Sync",
  },
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LiveEventsProvider>
          <GlobalStateProvider>
            {children}
            <LiveEventTicker />
          </GlobalStateProvider>
        </LiveEventsProvider>
      </body>
    </html>
  );
}
