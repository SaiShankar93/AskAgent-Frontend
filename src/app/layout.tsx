import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore - allow side-effect import of global CSS without a .d.ts declaration
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "AskAgent - Turn any website into a smart assistant",
  description:
    "AskAgent transforms any website into an AI-powered voice and chat assistant in seconds, providing instant answers to your visitors' questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}
      >
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
