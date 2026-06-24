"use client";

import React from "react";
import Link from "next/link";

export default function PricingPage() {
  const features = [
    "Full AI Stadium Cam Simulation Access",
    "High-Resolution Stadium Jumbotron Graphics",
    "Create Football Jersey Cards",
    "Instant Download & Sharing Capabilities"
  ];

  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans flex flex-col justify-between">
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-lime-400 mb-4 tracking-tight">
              Upgrade Your Experience
            </h1>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Get instant access to premium AI-generated stadium graphics and custom jersey cards.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white">Premium Country Edition</h2>
              <p className="text-xs text-zinc-500 mt-1">One-time payment.</p>
            </div>

            <div className="my-6 pt-2 pb-4 border-b border-zinc-800">
              <div className="flex items-baseline text-white">
                <span className="text-5xl font-black tracking-tight">$0.99</span>
                <span className="ml-2 text-sm font-semibold text-zinc-500">/ USD</span>
              </div>
              <p className="text-xs text-zinc-500 mt-3 italic">
                * Price excludes VAT/sales tax which will be calculated at checkout.
              </p>
            </div>

            {/* 피처 리스트 */}
            <ul className="space-y-3.5 my-8 text-sm">
              {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg
                        className="w-4 h-4 text-lime-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="text-zinc-300">{feature}</span>
                  </li>
              ))}
            </ul>

            {/* 결제/메인 이동 버튼 */}
            <button
                onClick={() => window.location.href = "/"} // 메인 페이지의 결제 위치로 유도
                className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-lime-400/10 active:scale-[0.98]"
            >
              Create your card!
            </button>
          </div>
        </div>
      </div>
  );
}