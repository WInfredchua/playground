import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropAds AI — Property Ad Generator",
  description:
    "Generate compelling property ads in seconds with AI. Create listings, social posts, email campaigns and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
