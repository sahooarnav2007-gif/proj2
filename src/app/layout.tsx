import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LiveEventsProvider } from "@/lib/liveEvents";
import { LiveEventTicker } from "@/components/LiveEventTicker";
import { GlobalStateProvider } from "@/lib/globalState";
import { Toasts } from "@/components/Toasts";
import { DemoTour } from "@/components/DemoTour";

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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-orange-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <LiveEventsProvider>
          <GlobalStateProvider>
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <LiveEventTicker />
            <Toasts />
            <DemoTour />
          </GlobalStateProvider>
        </LiveEventsProvider>
      </body>
    </html>
  );
}
