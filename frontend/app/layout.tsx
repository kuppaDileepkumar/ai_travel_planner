import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Travel Planner",
  description: "AI-powered Travel Planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
