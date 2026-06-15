import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";

// Next.js 최신 규격에 맞춰 params를 Promise 타입으로 정의
interface Props {
  params: Promise<{ id: string }>;
}

function renderMarkdown(content: string) {
  return content.split("\n").map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={index} className="h-4" />;

    if (trimmed.startsWith("###")) {
      return (
          <h3 key={index} className="text-xl font-bold text-white mt-8 mb-3 tracking-tight">
            {trimmed.replace("###", "").trim()}
          </h3>
      );
    }

    if (trimmed.startsWith("*")) {
      return (
          <li key={index} className="ml-5 list-disc text-zinc-400 mb-2">
            {trimmed.replace("*", "").trim()}
          </li>
      );
    }

    return <p key={index} className="text-sm text-zinc-400 leading-relaxed mb-4">{trimmed}</p>;
  });
}

// 🎯 최신 Next.js 호환을 위해 async 함수로 변경
export default async function BlogDetail({ params }: Props) {
  // 🎯 params를 await로 안전하게 받아옵니다.
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  // 목록 페이지와 동일하게 최상단 및 상대 경로 모두 탐색
  let postsDirectory = path.join(process.cwd(), "posts");
  if (!fs.existsSync(postsDirectory)) {
    postsDirectory = path.resolve("./posts");
  }

  const filePath = path.join(postsDirectory, `${id}.md`);

  // 디버깅용: 만약 파일이 없다면 콘솔에 실제 서버가 찾고 있는 경로를 찍어줍니다.
  if (!fs.existsSync(filePath)) {
    console.log(`[Blog Error] File not found at: ${filePath}`);
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const contentBody = fileContent.replace(/---([\s\S]*?)---/, "").trim();

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

  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">

          <div className="border-b border-zinc-800 pb-6 mb-8">
            <Link href="/blog" className="text-xs font-bold text-zinc-500 hover:text-lime-400 transition-colors uppercase tracking-wider block mb-4">
              ← Back to Blog List
            </Link>
            <span className="bg-zinc-800 text-lime-400 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wide inline-block mb-3">
            {metadata.category || "General"}
          </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
              {metadata.title || "Untitled"}
            </h1>
            <p className="text-xs text-zinc-500">{metadata.date || ""} • Informational Guide</p>
          </div>

          <div className="prose prose-invert max-w-none">
            {renderMarkdown(contentBody)}
          </div>

        </div>
      </div>
  );
}