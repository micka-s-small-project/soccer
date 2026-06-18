"use client";

import { useState } from "react";

// ⚽ Country mapping data for uniforms/stadiums
const COUNTRY_TEMPLATES: Record<string, { flag: string; mockJersey: string }> = {
  "South Korea": { flag: "🇰🇷", mockJersey: "https://images.unsplash.com/photo-1518098268272-e99c43a406b2?w=800&q=80" },
  "Brazil": { flag: "🇧🇷", mockJersey: "https://images.unsplash.com/photo-1560241723-d343467b7f14?w=800&q=80" },
  "Argentina": { flag: "🇦🇷", mockJersey: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80" },
  "France": { flag: "🇫🇷", mockJersey: "https://images.unsplash.com/photo-1431324155629-1a6aea185f5a?w=800&q=80" },
  "United Kingdom": { flag: "🏴%F0%9F%8F%B4%F0%9F%8F%A7%F0%9F%8F%A2%F0%9F%8F%A7%F0%9F%8F%B7", mockJersey: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80" },
  "Germany": { flag: "🇩🇪", mockJersey: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80" },
  "Spain": { flag: "🇪🇸", mockJersey: "https://images.unsplash.com/photo-1579952365111-3a479aa57a72?w=800&q=80" },
  "Japan": { flag: "🇯🇵", mockJersey: "https://images.unsplash.com/photo-1599151485067-a4994228c11e?w=800&q=80" },
  "Portugal": { flag: "🇵🇹", mockJersey: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80" },
  "Netherlands": { flag: "🇳🇱", mockJersey: "https://images.unsplash.com/photo-1489945052260-4f21c52268b9?w=800&q=80" },
  "Italy": { flag: "🇮🇹", mockJersey: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?w=800&q=80" },
  "Croatia": { flag: "🇭🇷", mockJersey: "https://images.unsplash.com/photo-1516567727245-ad8c68f3ec93?w=800&q=80" },
  "Morocco": { flag: "🇲🇦", mockJersey: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
  "USA": { flag: "🇺🇸", mockJersey: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80" },
  "Mexico": { flag: "🇲🇽", mockJersey: "https://images.unsplash.com/photo-1504155611830-97998068170b?w=800&q=80" },
  "Uruguay": { flag: "🇺🇾", mockJersey: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80" },
};

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("🏟️ Entering Stadium...");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("South Korea");

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 🔥 결제 완료 후 실행될 비동기 생성 및 폴링 컨트롤러
  const handleActivateCamera = async () => {
    if (!imageSrc) return alert("Please sub-in a player first (Upload a photo)! ⚽");

    setIsGenerating(true);
    setLoadingMessage("Securing ticket from AI Referee... 🎫");

    try {
      // [A] 백엔드에 결제 확인 후 비동기 생성 요청
      const response = await fetch("/api/generate-stadium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageSrc,
          country: selectedCountry,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "API Integration Failed");
      }

      const data = await response.json();

      // [B] 발급된 티켓 번호로 무조건 대기 루프(폴링) 가동
      if (data.predictionId) {
        console.log("🎟️ Ticket Received:", data.predictionId);

        // AI 작업 완공 처리까지 await로 브라우저를 붙잡아둡니다.
        const finalUrl = await runStatusCheckPolling(data.predictionId);

        setIsGenerating(false);
        if (finalUrl) {
          setResultImage(finalUrl);
        }
      } else {
        throw new Error("Prediction ID missing from server response.");
      }

    } catch (error: any) {
      console.error("Stadium Cam API Error:", error);
      setIsGenerating(false);
      alert(error.message || "Stadium Cam connection failed. Please try again! 🎥");
    }
  };

  // 🔄 백엔드가 최종 결과물을 뱉을 때까지 4초 주기로 상태 조회
  const runStatusCheckPolling = (predictionId: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/generate-stadium?id=${predictionId}`);
          if (!res.ok) throw new Error("Status check failed");

          const data = await res.json();
          console.log("⏳ Current AI Status:", data.status);

          if (data.status === "starting") {
            setLoadingMessage("Warming up the stadium floodlights... 💡");
          } else if (data.status === "processing") {
            setLoadingMessage("Rendering your face onto the massive Jumbotron screen... 🎨📺");
          } else if (data.status === "succeeded") {
            clearInterval(checkInterval);
            const finalUrl = Array.isArray(data.output) ? data.output[0] : data.output;
            resolve(finalUrl || null);
          } else if (data.status === "failed" || data.status === "canceled") {
            clearInterval(checkInterval);
            reject(new Error("AI generation failed. Please try a clearer face photo!"));
          }
        } catch (err) {
          console.error("Polling error (Retrying...):", err);
        }
      }, 4000);
    });
  };

  const handleReset = () => {
    setImageSrc(null);
    setResultImage(null);
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `stadium_${selectedCountry.toLowerCase().replace(" ", "_")}.png`;
    link.click();
  };

  const handleCopyImage = async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const item = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([item]);
      alert("Stadium card image copied directly to clipboard! 🎨⚽");
    } catch (err) {
      await navigator.clipboard.writeText(resultImage);
      alert("Image URL copied to clipboard! 📋");
    }
  };

  const handleLinkShare = async () => {
    if (!resultImage) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "LIVE: World Cup Stadium Screen!",
          text: `I just made it onto the big screen! Check out my Team ${selectedCountry} stadium card! ⚽`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Share link copied to clipboard! 🔗");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="flex flex-col flex-1 min-h-screen items-center justify-center bg-zinc-950 font-sans text-white relative">
        <main
            className="flex w-full max-w-3xl flex-col items-center justify-center py-20 px-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl mt-12"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
          {resultImage ? (
              <div className="flex flex-col items-center gap-8 text-center w-full">
            <span className="bg-lime-400 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
              📺 GOAL! {selectedCountry.toUpperCase()} UNIFORM GENERATED
            </span>
                <h1 className="max-w-xl text-3xl font-extrabold text-white">
                  🎉 You are on the {selectedCountry} Jumbotron!
                </h1>

                <div className="relative w-full max-w-lg border-4 border-lime-400 rounded-lg overflow-hidden shadow-2xl">
                  <img src={resultImage} alt={`${selectedCountry} AI Uniform`} className="w-full h-auto object-contain" />
                  <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded text-xs font-black tracking-widest animate-pulse">LIVE</div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs py-2 text-center text-xs font-bold text-lime-400">
                    STADIUM CAM • OFFICIAL {selectedCountry.toUpperCase()} JERSEY
                  </div>
                </div>

                <div className="w-full max-w-lg flex flex-col gap-3">
                  <button
                      onClick={handleDownload}
                      className="w-full h-14 rounded-xl font-black text-base tracking-wide transition-all shadow-lg bg-lime-400 text-black hover:bg-lime-300 shadow-lime-400/20 active:scale-[0.99]"
                  >
                    📥 Download {selectedCountry} Card
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleCopyImage} className="w-full h-14 rounded-xl font-black text-sm tracking-wide bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white">
                      📋 Copy Image Card
                    </button>
                    <button onClick={handleLinkShare} className="w-full h-14 rounded-xl font-black text-sm tracking-wide bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white">
                      🔗 Pass to Friends
                    </button>
                  </div>
                  <button onClick={handleReset} className="w-full mt-4 h-11 bg-transparent border border-zinc-800 rounded-xl font-bold text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all">
                    🔄 Substitute Player (Start Over)
                  </button>
                </div>
              </div>
          ) : (
              <div className="flex flex-col items-center gap-8 text-center w-full">
                <h1 className="max-w-xl text-3xl font-extrabold leading-10 tracking-tight text-lime-400">
                  📺 LIVE: Look at Yourself on the World Cup Stadium Screen!
                </h1>

                <div className="w-full max-w-lg text-left">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">🏆 Select Your Team</label>
                  <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="border border-zinc-700 bg-zinc-800 rounded-lg p-3.5 text-sm font-medium text-white w-full focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer transition-all"
                  >
                    {Object.keys(COUNTRY_TEMPLATES).map((country) => (
                        <option key={country} value={country}>
                          {country} {COUNTRY_TEMPLATES[country].flag}
                        </option>
                    ))}
                  </select>
                </div>

                {imageSrc ? (
                    <div className="relative w-full max-w-lg group">
                      <img src={imageSrc} alt="Uploaded" className="w-full h-auto object-contain rounded-lg border-2 border-lime-400/60" />
                      <button onClick={() => setImageSrc(null)} className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow">
                        🏃‍♂️ delete picture
                      </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full max-w-lg p-12 bg-zinc-850 border-2 border-dashed border-lime-400/40 rounded-xl cursor-pointer hover:bg-zinc-800 hover:border-lime-400 transition-all group">
                      <span className="text-4xl mb-3 group-hover:animate-bounce">⚽</span>
                      <p className="text-lg font-bold text-zinc-100">Be a Soccer Star!</p>
                      <p className="text-sm text-zinc-400 mt-1">Pass (Drop) your photo here or click to substitute player.</p>
                      <input type="file" onChange={handleFileInput} hidden />
                    </label>
                )}

                <button
                    onClick={handleActivateCamera}
                    disabled={!imageSrc}
                    className={`w-full max-w-lg h-14 rounded-xl font-black text-base tracking-wide transition-all shadow-lg ${
                        imageSrc ? "bg-lime-400 text-black hover:bg-lime-300 shadow-lime-400/20" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                >
                  🚀 ACTIVATE STADIUM CAM ($0.99)
                </button>
              </div>
          )}
        </main>

        {/* 🏟️ 유료 전환에 맞춤화된 몰입형 스타디움 로딩 스크린 (광고 제거 버전) */}
        {isGenerating && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1.5 bg-lime-400 w-full animate-pulse" />

                {/* 뱅글뱅글 도는 축구공 스피너 연출 */}
                <div className="w-16 h-16 border-4 border-t-lime-400 border-zinc-700 rounded-full animate-spin mx-auto mb-6"></div>

                <span className="text-xs font-black tracking-widest text-lime-400 uppercase block mb-1">
              LIVE STADIUM FEED TRANSMISSION
            </span>
                <h2 className="text-xl font-black text-white uppercase mb-3 tracking-tight animate-pulse">
                  🏟️ {loadingMessage}
                </h2>

                <p className="text-[11px] text-zinc-400 leading-normal font-medium max-w-xs mx-auto">
                  ⚡ Thank you for your premium order! We are currently securing your exclusive spectator perspective and custom uniform mapping. Standard render takes around 15 seconds. Please hold on!
                </p>
              </div>
            </div>
        )}
      </div>
  );
}