"use client";

export default function PrivacyPolicy() {
  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-black text-lime-400 mb-6">Privacy Policy</h1>
          <p className="text-xs text-zinc-500 mb-8">Effective Date: June 15, 2026</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Collected Personal Information and Collection Method</h2>
              <p>
                This Service generates AI images based on photos uploaded by users. Uploaded photo files are processed **temporarily in memory solely for image conversion purposes, and are never permanently stored or collected on our servers.**
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Purpose of Using Personal Information</h2>
              <p>
                The temporary data collected and processed is used exclusively to provide the &apos;AI Football Uniform Card and Jumbotron Composite Image Generation&apos; service requested by the user.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Use of Cookies and Third-Party Advertising Platforms</h2>
              <p>
                This Service may use the services of third-party advertising companies, including **Google AdSense**, to provide customized advertisements to users. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website.
              </p>
              <p className="mt-1 text-zinc-400">
                ※ Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Retention and Usage Period of Personal Information</h2>
              <p>
                In principle, this Service does not store users&apos; personal information or photo data on the server. Therefore, all data is immediately destroyed upon completion of the service request.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Contact Information</h2>
              <p>If you have any questions regarding this Privacy Policy, please contact us through the information page within the service.</p>
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