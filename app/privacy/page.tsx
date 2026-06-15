"use client";

export default function PrivacyPolicy() {
  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-black text-lime-400 mb-6">개인정보 처리방침 (Privacy Policy)</h1>
          <p className="text-xs text-zinc-500 mb-8">시행일자: 2026년 6월 15일</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. 수집하는 개인정보 항목 및 수집 방법</h2>
              <p>
                본 서비스는 사용자가 업로드하는 사진을 기반으로 AI 이미지를 생성합니다. 업로드된 사진 파일은 이미지를 변환하기 위한 용도로만 **임시로 메모리상에서 처리되며, 서버에 영구적으로 저장되거나 수집되지 않습니다.** </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. 개인정보의 이용 목적</h2>
              <p>
                수집 및 처리되는 임시 데이터는 오직 사용자가 요청한 'AI 축구 유니폼 카드 및 전광판 합성 이미지 생성' 서비스 제공을 위해서만 사용됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. 쿠키(Cookie) 및 제3자 광고 플랫폼 이용</h2>
              <p>
                본 서비스는 사용자에게 맞춤형 광고를 제공하기 위해 **Google AdSense**를 포함한 제3자 광고 기업의 서비스를 이용할 수 있습니다. Google과 같은 제3자 제공업체는 사용자의 이전 웹사이트 방문 기록을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다.
              </p>
              <p className="mt-1 text-zinc-400">
                ※ 사용자는 Google 광고 설정(https://adssettings.google.com)을 통해 맞춤설정 광고를 통제할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. 개인정보의 보유 및 이용기간</h2>
              <p>
                본 서비스는 원칙적으로 사용자의 개인정보나 사진 데이터를 서버에 보관하지 않으므로, 서비스 이용과 동시에 모든 데이터는 즉시 소멸합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. 문의처</h2>
              <p>본 개인정보 처리방침에 대해 궁금한 점이 있으시다면 서비스 내 안내 페이지를 통해 문의해 주시기 바랍니다.</p>
            </section>
          </div>

          <button
              onClick={() => window.history.back()}
              className="mt-8 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
  );
}