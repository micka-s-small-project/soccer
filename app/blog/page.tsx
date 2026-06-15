"use client";

import Link from "next/link";

// 📚 애드센스 봇이 좋아하는 고품질 영문 축구 포스팅 데이터 목록
const BLOG_POSTS = [
  {
    id: "history-of-football-jerseys",
    title: "The Evolution of Football Jerseys: From Wool to High-Tech Fabrics",
    description: "Discover how football kits transformed from heavy, water-absorbing wool sweaters in the 19th century into aerodynamic, moisture-wicking engineered garments worn by today's global superstars.",
    date: "June 14, 2026",
    readTime: "5 min read",
    category: "Jersey History"
  },
  {
    id: "iconic-world-cup-kits",
    title: "Top 5 Most Iconic World Cup Kits That Defined Football Culture",
    description: "An in-depth review of the most legendary jerseys in World Cup history, including Brazil's classic 1970 yellow shirt and West Germany's geometric 1990 masterpiece.",
    date: "June 12, 2026",
    readTime: "7 min read",
    category: "World Cup"
  },
  {
    id: "psychology-of-jersey-colors",
    title: "The Psychology of Colors in Football: Does Wearing Red Increase Win Rates?",
    description: "Exploring sports science and statistical studies behind football kit colors. Analyze how psychological triggers of colors like red, blue, and neon impact referee decisions and opponent behavior.",
    date: "June 10, 2026",
    readTime: "4 min read",
    category: "Sports Science"
  },
  {
    id: "how-jumbotrons-changed-stadiums",
    title: "Stadium Jumbotrons: How Big Screens Revolutionized Fan Engagement",
    description: "A look into the technological history of massive stadium screens. From simple scoreboard matrix displays to multi-million dollar 4K LED rings that shape modern matchday experiences.",
    date: "June 08, 2026",
    readTime: "6 min read",
    category: "Stadium Tech"
  },
  {
    id: "ai-in-modern-sports-graphics",
    title: "How Artificial Intelligence is Reshaping Live Sports Broadcasting",
    description: "An analysis of how computer vision and generative AI models instantly track player data, render real-time statistics overlays, and generate customized fan interaction cards.",
    date: "June 05, 2026",
    readTime: "5 min read",
    category: "AI & Tech"
  },
  {
    id: "guide-to-football-photography",
    title: "Capturing the Pitch: A Beginner's Guide to Dramatic Football Photography",
    description: "Learn the essential camera settings, shutter speed choices, and positioning angles required to capture stadium screen-ready, high-action moments during local or professional matches.",
    date: "June 01, 2026",
    readTime: "6 min read",
    category: "Photography"
  }
];

export default function BlogList() {
  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-4xl mx-auto">

          {/* 상단 헤더 영역 */}
          <div className="border-b border-zinc-800 pb-8 mb-12">
            <Link
                href="/"
                className="text-xs font-bold text-zinc-500 hover:text-lime-400 transition-colors uppercase tracking-wider block mb-3"
            >
              ← Back to Jumbotron Simulator
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Football Insights <span className="text-lime-400">&</span> Stories
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              Explore articles about iconic jerseys, stadium technology, and the evolution of modern football culture.
            </p>
          </div>

          {/* 블로그 포스트 그리드/리스트 */}
          <div className="space-y-8">
            {BLOG_POSTS.map((post) => (
                <article
                    key={post.id}
                    className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all shadow-lg group relative"
                >
                  <div className="flex items-center gap-3 text-xs mb-3">
                <span className="bg-zinc-800 text-lime-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                  {post.category}
                </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500">{post.date}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500">{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-extrabold text-white group-hover:text-lime-300 transition-colors mb-2">
                    <Link href={`/blog/${post.id}`}>
                      <span className="absolute inset-0 cursor-pointer" aria-hidden="true" />
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                    {post.description}
                  </p>

                  <div className="mt-4 flex items-center text-xs font-bold text-lime-400 group-hover:underline">
                    Read Article →
                  </div>
                </article>
            ))}
          </div>

          {/* 하단 페이지 공지 (애드센스 정책 준수 문구) */}
          <div className="mt-16 text-center text-xs text-zinc-600 border-t border-zinc-900 pt-6">
            Content on this informational blog is updated regularly to support the global football enthusiast community.
          </div>

        </div>
      </div>
  );
}