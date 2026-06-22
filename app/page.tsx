"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

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
  const [isSdkLoaded, setIsSdkLoaded] = useState<boolean>(false);

  const supportEmail = "edsolarrcnt5@gmail.com";
  const mailtoUrl = `mailto:${supportEmail}?subject=Stadium%20Cam%20Support%20Request&body=Hello%20User!,%0A%0APlease%20describe%20your%20issue.%20If%20this%20is%20regarding%20a%20paid%20transaction,%20please%20paste%20your%20PayPal%20Capture%20ID%20here:%20`;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageSrc(reader.result);
          console.log("📸 Image successfully parsed to base64 state hook.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActivateCamera = async (): Promise<boolean> => {
    if (!imageSrc) {
      alert("Please sub-in a player first (Upload a photo)! ⚽");
      return false;
    }

    setIsGenerating(true);
    setLoadingMessage("Securing ticket from AI Referee... 🎫");

    try {
      const response = await fetch("/api/generate-stadium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc, country: selectedCountry }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "API Integration Failed");
      }

      const data = await response.json();

      if (data.predictionId) {
        console.log("🎟️ Ticket Received:", data.predictionId);
        const finalUrl = await runStatusCheckPolling(data.predictionId);

        setIsGenerating(false);
        if (finalUrl) {
          setResultImage(finalUrl);
          return true;
        }
      }
      return false;

    } catch (error: any) {
      console.error("Stadium Cam API Error:", error);
      setIsGenerating(false);
      alert(error.message || "Stadium Cam connection failed. Please try again! 🎥");
      return false;
    }
  };

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

  useEffect(() => {
    if (resultImage || !imageSrc) {
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
      return;
    }

    if (!isSdkLoaded || !(window as any).paypal) return;

    let timerId: NodeJS.Timeout;

    const initPaypal = () => {
      const container = document.getElementById("paypal-button-container");

      if (!container) {
        timerId = setTimeout(initPaypal, 50);
        return;
      }

      if (container.children.length > 0) return;

      container.innerHTML = "";

      (window as any).paypal.Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: `AI Stadium Cam - ${selectedCountry} Edition`,
                amount: {
                  currency_code: "USD",
                  value: "0.99",
                },
              },
            ],
          });
        },

        onApprove: async (data: any, actions: any) => {
          try {
            const details = await actions.order.capture();
            const captureId = details.purchase_units[0].payments.captures[0].id;
            console.log("💰 Payment Captured:", captureId);

            (async () => {
              const isAiSuccess = await handleActivateCamera();

              if (!isAiSuccess) {
                setLoadingMessage("🔄 AI failed. Processing automatic refund...");

                const refundRes = await fetch("/api/paypal-refund", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ captureId }),
                });

                setIsGenerating(false);

                if (refundRes.ok) {
                  alert("🏟️ System Notice:\nAI generation failed. Your payment has been automatically refunded! 💳");
                } else {
                  alert("🏟️ System Notice:\nAI failed. Automatic refund failed. Please contact support! 📢");
                }
              } else {
                console.log("🚀 AI Generation Success! Moving to result screen.");
                setIsGenerating(false);
              }
            })();

            return Promise.resolve();

          } catch (err) {
            console.error("PayPal Error:", err);
            setIsGenerating(false);
            alert("Payment process was interrupted.");
          }
        },

        onError: (err: any) => {
          console.error("PayPal Error:", err);
          alert("Payment was interrupted. Please try again! 💳⚽");
        },
      }).render("#paypal-button-container");
    };

    initPaypal();

    return () => {
      if (timerId) clearTimeout(timerId);
    };

  }, [imageSrc, isSdkLoaded, selectedCountry, resultImage]);

  const handleReset = () => {
    setImageSrc(null);
    setResultImage(null);
  };

  const handleDownload = async () => {
    if (!resultImage) return;

    try {
      // 1. Point to your local API proxy route instead of the raw external URL
      const proxyUrl = `/api/download?url=${encodeURIComponent(resultImage)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) throw new Error("Proxy download failed");

      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = localUrl;
      link.download = `stadium_${selectedCountry.toLowerCase().replace(/\s+/g, "_")}.png`;

      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(localUrl);

    } catch (err) {
      console.error("Download failed, falling back to new window:", err);
      // Fallback: Opens the image link safely in a new tab if everything else breaks
      window.open(resultImage, '_blank', 'noopener,noreferrer');
    }
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
      /* 🌟 최상단 컨테이너 고친 점:
         1. 'overflow-y-auto'를 명시해서 콘텐츠가 길어지면 브라우저가 스크롤바를 강제로 만들도록 유도합니다.
         2. 스크롤 레이아웃에 맞게 'justify-start'와 충분한 상하 내부 패딩('pt-12 pb-16')을 확보했습니다. */
      <div className="flex flex-col min-h-screen justify-start items-center bg-zinc-950 font-sans text-white relative pt-12 pb-16 px-4 overflow-y-auto">
        <Script
            src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}
            strategy="afterInteractive"
            onLoad={() => setIsSdkLoaded(true)}
        />

        {/* 🌟 메인 영역 고친 점:
           불필요하게 화면을 꽉 채우던 고정 마진들을 유연한 갭 간격으로 정리했습니다. */}
        <main
            className="flex w-full max-w-3xl flex-col items-center justify-center py-16 px-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
          {resultImage ? (
              <div key="result-page" className="flex flex-col items-center gap-8 text-center w-full animate-fade-in">
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

                  <div className="mt-4 pt-4 border-t border-zinc-800/60 text-center">
                    <p className="text-[11px] text-zinc-500">
                      Problem with your image resolution?{" "}
                      <a href={mailtoUrl} className="text-lime-400 hover:underline transition-all">
                        Contact Developer Support
                      </a>
                    </p>
                  </div>
                </div>
              </div>
          ) : (
              <div key="upload-page" className="flex flex-col items-center gap-8 text-center w-full">
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
                      <input type="file" accept="image/*" onChange={handleFileInput} hidden />
                    </label>
                )}

                {!imageSrc && (
                    <button disabled
                            className="w-full max-w-lg h-14 rounded-xl font-black text-base bg-zinc-800 text-zinc-500 cursor-not-allowed">
                      🚀 UPLOAD PHOTO FIRST TO ACTIVATE CAM
                    </button>
                )}

                <div className="w-full max-w-lg mt-2 pt-4 border-t border-zinc-800/40 text-center">
                  <p className="text-[11px] text-zinc-500">
                    Payment or transaction issue?{" "}
                    <a href={mailtoUrl} className="text-zinc-400 hover:text-lime-400 hover:underline transition-all font-medium">
                      Email Support Agent
                    </a>
                  </p>
                </div>
              </div>
          )}

          <div
              className={`w-full max-w-lg mt-4 z-10 transition-all duration-300 ${
                  (imageSrc && !resultImage)
                      ? "opacity-100 h-auto pointer-events-auto block"
                      : "opacity-0 h-0 overflow-hidden pointer-events-none hidden"
              }`}
          >
            <p className="text-xs text-zinc-400 mb-2 font-bold uppercase tracking-widest text-center">
              💳 Premium Jumbotron Transmission ($0.99)
            </p>
            <div id="paypal-button-container" className="w-full min-h-[150px]"/>
          </div>
        </main>

        {/* 🌟 푸터 영역 고친 점:
           'mt-auto w-full max-w-3xl pt-10' 마진 트릭을 추가했습니다.
           콘텐츠 크기가 작을 땐 브라우저 바닥면에 딱 붙고, 이미지가 들어와 스크롤이 생기면 카드의 하단 흐름을 유연하게 따라갑니다. */}
        <footer className="mt-auto w-full max-w-3xl flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-10 border-t border-zinc-800/60 text-xs text-zinc-500 font-medium text-center">
          <Link href="/blog" className="hover:text-lime-400 transition-colors">
            📋 Football Insights (Blog)
          </Link>
          <span className="text-zinc-800 hidden sm:inline">|</span>
          <Link href="/privacy" className="hover:text-lime-400 transition-colors font-bold">
            🛡️ Privacy Policy
          </Link>
          <span className="text-zinc-800 hidden sm:inline">|</span>
          <Link href="/terms" className="hover:text-lime-400 transition-colors">
            ⚖️ Terms of Service
          </Link>
        </footer>

        {isGenerating && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1.5 bg-lime-400 w-full animate-pulse" />
                <div className="w-16 h-16 border-4 border-t-lime-400 border-zinc-700 rounded-full animate-spin mx-auto mb-5"></div>
                <span className="text-xs font-black tracking-widest text-lime-400 uppercase block mb-1">
                  LIVE STADIUM FEED TRANSMISSION
                </span>
                <h2 className="text-xl font-black text-white uppercase mb-4 tracking-tight">
                  🏟️ {loadingMessage}
                </h2>
                <div className="my-5 p-4 bg-zinc-950 border border-zinc-850 rounded-xl">
                  <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Estimated Render Time
                  </span>
                  <span className="text-3xl font-black text-lime-400 tracking-tight animate-pulse">
                    ⏱️ Max 3 Minutes
                  </span>
                  <p className="text-[11px] text-zinc-400 mt-2 font-medium">
                    Our AI model is compiling high-definition stadium environments, complex jersey shaders, and billboard matrices.
                  </p>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium max-w-xs mx-auto">
                  ⚡ Order confirmed. Your deep graphics compute has been safely spun up! <br />
                  <span className="text-lime-400/80">Please do not refresh or close this browser window.</span> You will be automatically redirected to your card once finished.
                </p>
              </div>
            </div>
        )}
      </div>
  );
}