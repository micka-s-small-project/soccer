import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Micka-Lab | Football Insights & Jumbotron Simulator",

  description: "Explore deep football stories, jersey evolution, sports science, and interactive jumbotron live simulations at Micka-Lab.",

  keywords: ["Football", "Jumbotron", "Soccer Simulator", "Football Insights", "Sports Science"],

  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <head>
        <script async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5765606467083360"
                crossOrigin="anonymous"></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
      </body>
      </html>
  );
}