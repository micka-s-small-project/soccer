import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx 수정

export const metadata = {
  // 🎯 웹 브라우저 탭에 표시될 메인 제목
  title: "Micka-Lab | Football Insights & Jumbotron Simulator",

  // 🎯 구글 검색엔진이 수집해갈 사이트 한 줄 요약 설명
  description: "Explore deep football stories, jersey evolution, sports science, and interactive jumbotron live simulations at Micka-Lab.",

// 🎯 파비콘 파일 경로를 강제로 명시하여 기본 아이콘을 무시하도록 설정
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body>{children}</body>
      </html>
  );
}
