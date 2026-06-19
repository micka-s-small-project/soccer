"use client";

export default function PrivacyPolicy() {
  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-black text-lime-400 mb-6">Privacy Policy</h1>
          <p className="text-xs text-zinc-500 mb-8">Effective Date: June 15, 2026</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Personal Data Collected & Collection Method</h2>
              <p>
                This service generates AI images based on photos uploaded by the user. Uploaded photo files are strictly processed **temporarily in-memory for the sole purpose of image conversion and are never permanently stored or collected on our servers.**
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Purpose of Using Personal Data</h2>
              <p>
                The temporarily processed data is used exclusively to deliver the "AI Football Jersey Card & Jumbotron Composite Image Generation" service requested by the user.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Cookies & Third-Party Advertising Platforms</h2>
              <p>
                To provide tailored advertisements to our users, this service may utilize services from third-party advertising entities, including **Google AdSense**. Google and other third-party vendors use cookies to serve ads based on a user&apos;s prior visits to this or other websites.
              </p>
              <p className="mt-1 text-zinc-400">
                ※ Users can opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Data Retention & Preservation Period</h2>
              <p>
                As a matter of principle, this service does not retain your personal info or photo data on any server. Consequently, all tracking data is automatically destroyed immediately upon completion of the service loop.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Contact Information</h2>
              <p>
                If you have any questions or concerns regarding this Privacy Policy, please feel free to contact us through the official support channels provided on our main page.
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