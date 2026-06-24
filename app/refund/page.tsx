"use client";

export default function RefundPolicy() {
  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-black text-lime-400 mb-6">Refund Policy</h1>
          <p className="text-xs text-zinc-500 mb-8">Last Updated: June 24, 2026</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Digital Goods Non-Refundable Policy</h2>
              <p>
                Due to the digital and instantaneous nature of the AI Soccer Jumbotron Simulator platform ("Service"), all purchases made for premium rendering, customizable jersey cards, and stadium graphics are final. Once the digital assets are generated and delivered to your account or device, they cannot be returned or refunded.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Exceptions for Technical Issues</h2>
              <p>
                We want you to have a great experience. Exceptions to this non-refundable policy may be considered under the following limited circumstances:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                <li>A confirmed technical error or system glitch on our server prevents the generation or download of your custom graphic after a successful payment.</li>
                <li>You were accidentally double-billed or charged multiple times for a single unintended transaction.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. How to Request a Review</h2>
              <p>
                If you believe your situation qualifies for an exception, please submit a support request within fourteen (14) days of your purchase. Because our orders are processed through paypal, our online reseller and Merchant of Record, you can also contact Paddle Customer Support directly to resolve billing disputes or file a formal refund inquiry.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Chargebacks and Disputes</h2>
              <p>
                Initiating a chargeback or payment dispute without contacting customer support first may result in the immediate and permanent suspension of your access to the Service and any related generated content.
              </p>
            </section>
          </div>

          <button
              onClick={() => window.history.back()}
              className="mt-8 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
  );
}