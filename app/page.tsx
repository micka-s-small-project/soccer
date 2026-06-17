"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// ⚽ 국가별 유니폼/스태디움 매핑 데이터
const COUNTRY_TEMPLATES: Record<string, { flag: string; mockJersey: string }> = {
  "South Korea": {
    flag: "🇰🇷",
    mockJersey: "https://images.unsplash.com/photo-1518098268272-e99c43a406b2?w=800&q=80"
  },
  "Brazil": {
    flag: "🇧🇷",
    mockJersey: "https://images.unsplash.com/photo-1560241723-d343467b7f14?w=800&q=80"
  },
  "Argentina": {
    flag: "🇦🇷",
    mockJersey: "https://images.unsplash.com/photo-150809868272-e99c43a406b2?w=800&q=80"
  },
  "France": {
    flag: "🇫🇷",
    mockJersey: "https://images.unsplash.com/photo-1431324155629-1a6aea185f5a?w=800&q=80"
  },
  "United Kingdom": {
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    mockJersey: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80"
  },
  "Germany": {
    flag: "🇩🇪",
    mockJersey: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80"
  },
  "Spain": {
    flag: "🇪🇸",
    mockJersey: "https://images.unsplash.com/photo-1579952365111-3a479aa57a72?w=800&q=80"
  },
  "Japan": {
    flag: "🇯🇵",
    mockJersey: "https://images.unsplash.com/photo-1599151485067-a4994228c11e?w=800&q=80"
  },
  "Portugal": {
    flag: "🇵🇹",
    mockJersey: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80"
  },
  "Netherlands": {
    flag: "🇳🇱",
    mockJersey: "https://images.unsplash.com/photo-1489945052260-4f21c52268b9?w=800&q=80"
  },
  "Italy": {
    flag: "🇮🇹",
    mockJersey: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?w=800&q=80"
  },
  "Croatia": {
    flag: "🇭🇷",
    mockJersey: "https://images.unsplash.com/photo-1516567727245-ad8c68f3ec93?w=800&q=80"
  },
  "Morocco": {
    flag: "🇲🇦",
    mockJersey: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80"
  },
  "USA": {
    flag: "🇺🇸",
    mockJersey: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80"
  },
  "Mexico": {
    flag: "🇲🇽",
    mockJersey: "https://images.unsplash.com/photo-1504155611830-97998068170b?w=800&q=80"
  },
  "Uruguay": {
    flag: "🇺🇾",
    mockJersey: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80"
  },
};

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showAd, setShowAd] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("South Korea");
  const [timeLeft, setTimeLeft] = useState<number>(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showAd && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [showAd, timeLeft]);

  useEffect(() => {
    if (showAd) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [showAd]);

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

  const handleActivateCamera = async () => {
    if (!imageSrc) return alert("Please sub-in a player first (Upload a photo)! ⚽");

    setTimeLeft(3);
    setShowAd(true);
    setIsGenerating(true);

    try {
      // API 호출과 최소 3초 대기 딜레이를 병렬로 처리하여 자연스러운 로딩 연출
      const apiPromise = fetch("/api/generate-stadium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc, country: selectedCountry }),
      });

      const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));

      const [response] = await Promise.all([apiPromise, delayPromise]);

      if (!response.ok) throw new Error("API 토큰 만료 또는 합성 실패");
      const data = await response.json();

      setResultImage(data.resultUrl);
      setShowAd(false);
      setIsGenerating(false);

    } catch (error) {
      console.error("Face Swap Error:", error);
      alert("Stadium Cam connection failed. Please try again!");
      setShowAd(false);
      setIsGenerating(false);
    }
  };

  // 광고 완료 핸들러 수정
  const handleAdComplete = async () => {
    setShowAd(false);
    setIsGenerating(false);
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
      alert("Stadium card image copied directly to clipboard! Paste it into your chat (Ctrl+V)! 🎨⚽");
    } catch (err) {
      console.error('Clipboard image write error: ', err);
      try {
        await navigator.clipboard.writeText(resultImage);
        alert("Image URL copied to clipboard! 📋");
      } catch (textErr) {
        alert("Copy failed. Please use the 'Download' button! 📥");
      }
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
        alert("Share link copied to clipboard! Pass it to your friends! 🔗");
      }
    } catch (err) {
      console.error('Sharing error: ', err);
    }
  };

  return (
      <div className="flex flex-col flex-1 min-h-screen items-center justify-center bg-zinc-950 font-sans text-white relative">
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />

        {/* ⚽ Main Application Section */}
        <main
            className="flex w-full max-w-3xl flex-col items-center justify-center py-20 px-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl mt-12"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
          {resultImage ? (
              <div className="flex flex-col items-center gap-8 text-center w-full animate-fade-in">
                <span className="bg-lime-400 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                  📺 GOAL! {selectedCountry.toUpperCase()} UNIFORM GENERATED
                </span>
                <h1 className="max-w-xl text-3xl font-extrabold text-white">
                  🎉 You are on the {selectedCountry} Jumbotron!
                </h1>

                <div className="relative w-full max-w-lg border-4 border-lime-400 rounded-lg overflow-hidden shadow-2xl">
                  <img src={resultImage} alt={`${selectedCountry} AI Uniform`} className="w-full h-auto object-contain"/>
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
                    <button
                        onClick={handleCopyImage}
                        className="w-full h-14 rounded-xl font-black text-sm tracking-wide transition-all bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white"
                    >
                      📋 Copy Image Card
                    </button>
                    <button
                        onClick={handleLinkShare}
                        className="w-full h-14 rounded-xl font-black text-sm tracking-wide transition-all bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white"
                    >
                      🔗 Pass to Friends
                    </button>
                  </div>

                  <button
                      onClick={handleReset}
                      className="w-full mt-4 h-11 bg-transparent border border-zinc-800 rounded-xl font-bold text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all"
                  >
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    🏆 Select Your Team
                  </label>
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
                      <img src={imageSrc} alt="Uploaded" className="w-full h-auto object-contain rounded-lg border-2 border-lime-400/60"/>
                      <button
                          onClick={() => setImageSrc(null)}
                          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors shadow"
                      >
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
                  🚀 ACTIVATE STADIUM CAM
                </button>
              </div>
          )}
        </main>

        {/* 📚 [AdSense Approval Booster] English Footer Content & Link Section */}
        <footer className="w-full max-w-3xl mt-16 mb-12 p-8 border-t border-zinc-800 text-zinc-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            {/* Left Area: Explanatory text optimized for AdSense indexer bots */}
            <div>
              <h3 className="text-base font-bold text-lime-400 mb-3">AI Soccer Jumbotron Simulator</h3>
              <p className="text-xs leading-relaxed text-zinc-500">
                Experience the dynamic energy of world-class football matches with your personal photos! This simulator utilizes an advanced web application framework to seamlessly render customized stadium graphics matching jerseys from major football nations including South Korea, Brazil, France, and Argentina.
              </p>
              <p className="text-xs leading-relaxed text-zinc-500 mt-2">
                All uploaded user photos are processed instantly in runtime memory solely for graphic composition and are never permanently stored or logs collected on our infrastructure. Feel free to download your stadium card or copy it directly to your clipboard to share with online global football fan communities.
              </p>
            </div>

            {/* Right Area: Navigation to blog posts and legal compliance guidelines */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">Football Insights & Support</h3>
              <ul className="space-y-3 text-xs">
                <li>
                  <a href="/blog" className="text-lime-400 hover:underline font-semibold flex items-center gap-1">
                    <span>📚</span> Football Story Blog (Jersey History & Guides)
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
                    <span>🔒</span> Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-zinc-300 transition-colors flex items-center gap-1">
                    <span>📜</span> Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-[11px] text-zinc-600 border-t border-zinc-900 pt-6">
            © 2026 AI Stadium Cam. All rights reserved. This website strictly adheres to the Google AdSense Program Policies.
          </div>
        </footer>

        {/* Interstitial Ad / Buffer Screen */}
        {showAd && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl relative overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-1.5 bg-lime-400 transition-all duration-1000 ease-linear"
                    style={{width: `${(timeLeft / 3) * 100}%`}}
                />

                <span className="text-xs font-black tracking-widest text-zinc-500 uppercase block mb-1">Halftime Commercial</span>
                <h2 className="text-lg font-black text-white uppercase mb-4">
                  Entering Stadium...
                </h2>

                <div className="w-full min-h-[250px] bg-black border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                  <ins className="adsbygoogle"
                       style={{display: "block", width: "300px", height: "250px"}}
                       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                       data-ad-slot="XXXXXXXXXX"
                       data-ad-format="auto"
                       data-full-width-responsive="true"></ins>
                </div>

                <p className="text-[11px] text-zinc-500 mt-4 leading-normal">
                  Your World Cup Stadium Jumbotron Card will be ready immediately after the sponsor message. Thank you for your patience!
                </p>
              </div>
            </div>
        )}
      </div>
  );
}