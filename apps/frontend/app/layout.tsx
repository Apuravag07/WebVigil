import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Appbar } from "../components/Appbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WebVigil — Decentralized Uptime Monitoring",
  description:
    "Monitor your websites and APIs 24/7 with a decentralized network of validators. Get instant alerts, detailed analytics, and guaranteed uptime insights.",
  keywords: ["uptime monitoring", "website monitoring", "decentralized", "Solana", "alerts"],
  authors: [{ name: "WebVigil" }],
  openGraph: {
    title: "WebVigil — Decentralized Uptime Monitoring",
    description: "Monitor your websites 24/7 with a decentralized validator network.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ThemeProvider defaultTheme="dark" attribute="class" forcedTheme="dark">
            <Appbar />
            {children}
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
