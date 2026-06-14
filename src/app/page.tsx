import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showAd, setShowAd] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main
        className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            📺 LIVE: Look at Yourself on the World Cup Stadium Screen!
          </h1>
          {imageSrc ? (
            <div className="relative w-full max-w-lg">
              <img
                src={imageSrc}
                alt="Uploaded Image"
                className="w-full h-auto object-contain rounded-lg border border-lime-400"
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center w-full max-w-lg p-8 bg-emerald-600 border border-lime-400 rounded-lg cursor-pointer hover:bg-[#359d2a]"
            >
              <p className="text-white">
                ⚽ Be a Soccer Star! Pass (Drop) your photo here or click to substitute player.
              </p>
              <input type="file" onChange={handleFileInput} hidden />
            </div>
          )}
        </div>

        {/* Dropdown for major nations */}
        <select
          className="mt-4 w-full max-w-lg bg-zinc-800 text-white border border-lime-400 rounded px-3 py-2"
          id="nation-select"
        >
          <option value="korea">South Korea 🇰🇷</option>
          <option value="brazil">Brazil 🇧🇷</option>
          <option value="argentina">Argentina 🇦🇷</option>
          <option value="france">France 🇫🇷</option>
          <option value="england">England 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
          <option value="germany">Germany 🇩🇪</option>
          <option value="spain">Spain 🇪🇸</option>
          <option value="japan">Japan 🇯🇵</option>
          <option value="portugal">Portugal 🇵🇹</option>
          <option value="netherlands">Netherlands 🇳🇱</option>
          <option value="italy">Italy 🇮🇹</option>
          <option value="croatia">Croatia 🇭🇷</option>
          <option value="morocco">Morocco 🇲🇦</option>
          <option value="usa">USA 🇺🇸</option>
          <option value="mexico">Mexico 🇲🇽</option>
          <option value="uruguay">Uruguay 🇺🇾</option>
        </select>

        {/* Sports-themed CTA button */}
        <button
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 border border-lime-400 px-5 text-white hover:bg-[#359d2a]"
        >
          🚀 Activate AI Stadium Cam (Watch Ad to Launch)
        </button>
      </main>
    </div>
  );
}