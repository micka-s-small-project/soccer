"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showAd, setShowAd] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("South Korea");

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🚀 AI 중계 카메라 트리거 함수
  const handleActivateCamera = () => {
    if (!imageSrc) return alert("먼저 선수를 입장(사진 업로드)시켜주세요! ⚽");
    setShowAd(true);
    setIsGenerating(true);
    // TODO: 다음 단계에서 5초 광고 팝업 띄우기 로직을 여기에 조립할 거야!
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'stadium_card.png';
    link.click();
  };

  const handleCopyImage = async () => {
    if (!resultImage) return;
    try {
      await navigator.clipboard.writeText(resultImage);
      alert("이미지가 클립보드에 복사되었습니다.");
    } catch (err) {
      console.error('클립보드 쓰기 오류: ', err);
    }
  };

  const handleLinkShare = async () => {
    if (!resultImage) return;
    try {
      await navigator.share({
        title: "Look at Yourself on the World Cup Stadium Screen!",
        text: "Check out this amazing stadium card I made with AI!",
        url: resultImage,
      });
    } catch (err) {
      console.error('공유 오류: ', err);
      // Fallback to clipboard if share fails
      await navigator.clipboard.writeText(resultImage);
      alert("이미지 URL이 클립보드에 복사되었습니다.");
    }
  };

  return (
      <div className="flex flex-col flex-1 min-h-screen items-center justify-center bg-zinc-950 font-sans text-white">
        <main
            className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-20 px-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-8 text-center w-full">
            <h1 className="max-w-xl text-3xl font-extrabold leading-10 tracking-tight text-lime-400">
              📺 LIVE: Look at Yourself on the World Cup Stadium Screen!
            </h1>

            <div className="w-full max-w-lg text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                🏆 Select Your Team
              </label>
              <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="border border-zinc-700 bg-zinc-800 rounded-lg p-3.5 text-sm font-medium text-white w-full focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer transition-all"
              >
                <option value="South Korea">South Korea 🇰🇷</option>
                <option value="Brazil">Brazil 🇧🇷</option>
                <option value="Argentina">Argentina 🇦🇷</option>
                <option value="France">France 🇫🇷</option>
                <option value="United Kingdom">England 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
                <option value="Germany">Germany 🇩🇪</option>
                <option value="Spain">Spain 🇪🇸</option>
                <option value="Japan">Japan 🇯🇵</option>
                <option value="Portugal">Portugal 🇵🇹</option>
                <option value="Netherlands">Netherlands 🇳🇱</option>
                <option value="Italy">Italy 🇮🇹</option>
                <option value="Croatia">Croatia 🇭🇷</option>
                <option value="Morocco">Morocco 🇲🇦</option>
              </select>
            </div>

            {imageSrc && (
              <>
                <button
                  onClick={handleDownload}
                  className="w-full max-w-lg h-14 rounded-xl font-black text-base tracking-wide transition-all shadow-lg bg-lime-400 text-black hover:bg-lime-300 shadow-lime-400/20 active:scale-[0.99]"
                >
                  📥 Download Stadium Card
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopyImage}
                    className="w-full h-14 rounded-xl font-black text-base tracking-wide transition-all shadow-lg bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white"
                  >
                    📋 Copy Image
                  </button>
                  <button
                    onClick={handleLinkShare}
                    className="w-full h-14 rounded-xl font-black text-base tracking-wide transition-all shadow-lg bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white"
                  >
                    🔗 Pass Link to Friends
                  </button>
                </div>
              </>
            )}

            {showAd && <div>Ad Modal Content...</div>}
          </div>
        </main>
      </div>
  );
}