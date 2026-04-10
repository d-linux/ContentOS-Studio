import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider, PostHogPageView } from "@posthog/next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContentOS Studio",
  description:
    "Your Personal Video Director — a full content production system for creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="flex min-h-full flex-col">
          <PostHogProvider clientOptions={{ api_host: "/ingest" }}>
            <PostHogPageView />
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
