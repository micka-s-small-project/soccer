import fs from "fs";
import path from "path";
import Link from "next/link";

function getPostMetadata(postsDirectory: string, fileName: string) {
  const filePath = path.join(postsDirectory, fileName);
  const fileContent = fs.readFileSync(filePath, "utf8");

  const metaMatch = fileContent.match(/---([\s\S]*?)---/);
  const metadata: Record<string, string> = {};

  if (metaMatch && metaMatch[1]) {
    metaMatch[1].split("\n").forEach(line => {
      const index = line.indexOf(":");
      if (index !== -1) {
        const key = line.substring(0, index).trim();
        const value = line.substring(index + 1).trim().replace(/^["']|["']$/g, '');
        metadata[key] = value;
      }
    });
  }

  return {
    id: fileName.replace(".md", ""),
    title: metadata.title || "Untitled",
    date: metadata.date || "",
    category: metadata.category || "General",
    description: metadata.description || "",
  };
}

export default function BlogList() {
  // 🎯 경로를 다각도로 체크할 수 있도록 헬퍼 구성
  let postsDirectory = path.join(process.cwd(), "posts");

  // 만약 현재 작업 디렉토리 기준 상위에 있거나 다른 환경일 때를 대비한 Fallback 경로 설정
  if (!fs.existsSync(postsDirectory)) {
    postsDirectory = path.resolve("./posts");
  }

  // 그래도 폴더가 없다면 디버깅용 메시지 출력
  if (!fs.existsSync(postsDirectory)) {
    return (
        <div className="text-center py-20 text-zinc-500">
          <p>No posts found. Folder missing at:</p>
          <code className="text-xs text-red-400 block mt-2 bg-zinc-900 p-2 rounded max-w-md mx-auto">{postsDirectory}</code>
        </div>
    );
  }

  const fileNames = fs.readdirSync(postsDirectory).filter(file => file.endsWith(".md"));

  // 폴더는 존재하나 내부 md 파일이 파싱되지 않았을 때
  if (fileNames.length === 0) {
    return (
        <div className="text-center py-20 text-zinc-500">
          <p>The &apos;posts&apos; folder exists, but no <code className="text-lime-400">.md</code> files were found inside.</p>
          <p className="text-xs text-zinc-600 mt-2">Target path: {postsDirectory}</p>
        </div>
    );
  }

  const posts = fileNames.map(fileName => getPostMetadata(postsDirectory, fileName));

  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="border-b border-zinc-800 pb-8 mb-12">
            <Link href="/" className="text-xs font-bold text-zinc-500 hover:text-lime-400 transition-colors uppercase tracking-wider block mb-3">
              ← Back to Jumbotron Simulator
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Football Insights <span className="text-lime-400">&</span> Stories
            </h1>
          </div>

          <div className="space-y-8">
            {posts.map((post) => (
                <article key={post.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all shadow-lg group relative">
                  <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="bg-zinc-800 text-lime-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">{post.category}</span>
                    <span className="text-zinc-500">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white group-hover:text-lime-300 transition-colors mb-2">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">{post.description}</p>
                  <div className="mt-4 flex items-center text-xs font-bold text-lime-400 group-hover:underline">Read Article →</div>
                </article>
            ))}
          </div>
        </div>
      </div>
  );
}