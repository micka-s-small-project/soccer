"use client";

export default function TermsOfService() {
  return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 py-16 px-6 font-sans">
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-black text-lime-400 mb-6">Terms of Service</h1>
          <p className="text-xs text-zinc-500 mb-8">Last Updated: June 15, 2026</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this AI Soccer Jumbotron Simulator platform ("Service"), you agree to be bound by and comply with these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Description of Service</h2>
              <p>
                This Service provides an entertainment-oriented simulation that generates customized football stadium graphics and jersey cards utilizing user-uploaded content. This tool is strictly intended for personal, casual, and non-commercial entertainment purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. User Obligations and Content Guidelines</h2>
              <p>
                You retain ownership of any media assets you provide to the Service. However, by uploading photos, you warrant that you possess the necessary rights and permissions to do so. You agree not to upload any material that is offensive, defamatory, unlawful, or infringes upon third-party intellectual property or privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Disclaimers and Limitations of Liability</h2>
              <p>
                The Service and all simulated outputs are provided on an "as-is" and "as-available" basis without warranties of any kind. We do not guarantee that the generated graphics will perfectly match official sports merchandise or corporate branding. In no event shall the platform owners be liable for any transient data modifications or unintended user experiences.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Third-Party Advertisements and External Links</h2>
              <p>
                To subsidize running costs, this platform serves advertisements facilitated by Google AdSense and third-party networks. Interactions with advertisements or external domains found on this website are exclusively between you and the respective advertisers, regulated under their independent operational policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Modifications to Service and Terms</h2>
              <p>
                We reserve the right to alter, suspend, or discontinue any aspect of the simulation system or modify these Terms of Service at any given time without prior announcement. Continued usage of the application indicates definitive acceptance of the updated conditions.
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