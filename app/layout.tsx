import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://micka-lab.com"), // 🌟 Put your actual domain here!
  title: "Micka-Lab | Football Insights & Jumbotron Simulator",
  description: "Explore deep football stories, jersey evolution, sports science, and interactive jumbotron live simulations at Micka-Lab.",
  keywords: ["Football", "Jumbotron", "Soccer Simulator", "Football Insights", "Sports Science"],
  icons: {
    icon: "/icon.png",
  },

  verification: {
    other: {
      "google-site-verification": "7c32BZjEU4U7RC2Gze3ZJ03scOcVKqdumOMju_KGMuw",
      "naver-site-verification": "50358dc7510c13c224b2041e18b2b83774b06ce1",
    },
  },

  openGraph: {
    title: "Micka-Lab | Football Insights & Jumbotron Simulator",
    description: "Explore deep football stories, jersey evolution, sports science, and interactive jumbotron live simulations.",
    url: "https://micka-lab.com",
    siteName: "Micka-Lab",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <head>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5765606467083360"
            crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased`}>
      {children}
      <Analytics />
      </body>
      </html>
  );
}