
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firebase Bulk Checker",
  description: "Authorized Firebase project status dashboard",
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
