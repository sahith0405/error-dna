import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERROR DNA — Understand Your Coding Patterns",
  description:
    "Practice coding. Discover your recurring mistakes with ERROR DNA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}