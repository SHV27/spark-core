import type { Metadata, Viewport } from "next";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Council: load all three families via next/font/google over self-hosting or
// <link> tags, because it eliminates layout shift and exposes CSS variables
// that Tailwind's fontFamily config consumes directly.
const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://shauryaverma.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shaurya Verma — AI/ML Engineer",
  description:
    "Third-year CS student building intelligent systems that learn, reason, and solve. Deep learning, computer vision, and LLM-powered systems.",
  keywords: [
    "Shaurya Verma",
    "AI Engineer",
    "ML Engineer",
    "Deep Learning",
    "Computer Vision",
    "LLM",
    "TIET",
    "Thapar",
  ],
  authors: [{ name: "Shaurya Verma" }],
  openGraph: {
    title: "Shaurya Verma — AI/ML Engineer",
    description:
      "I build intelligent systems that learn, reason, and solve. Deep learning, computer vision, and LLM-powered systems.",
    url: siteUrl,
    siteName: "Shaurya Verma",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shaurya Verma — AI/ML Engineer",
    description:
      "I build intelligent systems that learn, reason, and solve.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080C16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
