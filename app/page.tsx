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

  return (
      // 배경을 딥한 스타디움 다크 테마(bg-zinc-950)로 변경하여 몰입감 업그레이드!
      <div className="flex flex-col flex-1 min-h-screen items-center justify-center bg-zinc-950 font-sans text-white">
        <main
            className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-20 px-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-8 text-center w-full">
            {/* 📺 타이틀을 실제 월드컵 라이브 방송 스코어보드 느낌으로 튜닝! */}
            <h1 className="max-w-xl text-3xl font-extrabold leading-10 tracking-tight text-lime-400">
              📺 LIVE: Look at Yourself on the World Cup Stadium Screen!
            </h1>

            {/* 🌍 16개국 주요 축구 강국과 국기 이모지 추가 및 세련된 셀렉트 박스 */}
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
                <option value="USA">USA 🇺🇸</option>
                <option value="Mexico">Mexico 🇲🇽</option>
                <option value="Uruguay">Uruguay 🇺🇾</option>
              </select>
            </div>

            {/* ⚽ 드롭존 영역: 위트 넘치는 카피라이팅과 네온 라임 보더 테두리 */}
            {imageSrc ? (
                <div className="relative w-full max-w-lg group">
                  <img
                      src={imageSrc}
                      alt="Uploaded Image"
                      className="w-full h-auto object-contain rounded-lg border-2 border-lime-400 shadow-lg shadow-lime-500/10"
                  />
                  <button
                      onClick={() => setImageSrc(null)}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow"
                  >
                    🏃‍♂️ delete picture
                  </button>
                </div>
            ) : (
                <label
                    className="flex flex-col items-center justify-center w-full max-w-lg p-12 bg-zinc-850 border-2 border-dashed border-lime-400/40 rounded-xl cursor-pointer hover:bg-zinc-800 hover:border-lime-400 transition-all group"
                >
                  <span className="text-4xl mb-3 group-hover:animate-bounce">⚽</span>
                  <p className="text-lg font-bold text-zinc-100">Be a Soccer Star!</p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Pass (Drop) your photo here or click to substitute player.
                  </p>
                  <input type="file" onChange={handleFileInput} hidden />
                </label>
            )}

            {/* 🚀 다음 조각(광고 연동)을 스무스하게 붙이기 위한 작동 버튼 */}
            <button
                onClick={handleActivateCamera}
                disabled={!imageSrc}
                className={`w-full max-w-lg h-14 rounded-xl font-black text-base tracking-wide transition-all shadow-lg ${
                    imageSrc
                        ? "bg-lime-400 text-black hover:bg-lime-300 shadow-lime-400/20 active:scale-[0.99]"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
            >
              🚀 ACTIVATE STADIUM CAM
            </button>
          </div>
        </main>
      </div>
  );
}