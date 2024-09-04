import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'WorldWire',
  description: 'Stay updated with the latest news from The Guardian',
  keywords: 'news, guardian, current events, world news',
  openGraph: {
    title: 'WorldWire',
    description: 'Stay updated with the latest news from The Guardian',
    images: [
      {
        url: 'https://example.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WorldWire',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldWire',
    description: 'Stay updated with the latest news from The Guardian',
    images: ['https://example.com/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
