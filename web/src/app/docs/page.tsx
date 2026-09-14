import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-[1160px] px-6 py-10 w-full grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden md:block border-r border-[#172A42]/10 pr-6 text-[13px]">
          <div className="font-medium text-[#0B1F3A]">Lenear Docs</div>
          <div className="mt-4 space-y-1.5 text-[#8B9AB0]">
            <a href="#quickstart" className="block text-[#0B1F3A] font-medium">Quick start</a>
            <a href="#commands" className="block hover:text-[#0B1F3A]">Commands</a>
            <a href="#review" className="block hover:text-[#0B1F3A]">Review semantics</a>
            <a href="#config" className="block hover:text-[#0B1F3A]">Config</a>
            <a href="#auth" className="block hover:text-[#0B1F3A]">Auth & Projects</a>
            <a href="#dashboard" className="block hover:text-[#0B1F3A]">Dashboard</a>
            <a href="#troubleshoot" className="block hover:text-[#0B1F3A]">Troubleshoot</a>
          </div>
        </aside>
        <div className="min-w-0">
          <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">Documentation — Full CLI Table</div>
          <h1 className="mt-2 text-[28px] font-semibold tracking-tight">Lenear — catch it before they do.</h1>
          <p className="mt-3 text-[14px] leading-6 text-[#8B9AB0]">
            Lenear is a terminal code reviewer (Nvidia + Groq) with project workspaces. Install once, run anywhere. No
            npm publish required — Windows standalone via GitHub Release.
          </p>

          <h2 id="quickstart" className="mt-10 text-[18px] font-semibold">Quick start (Windows)</h2>
          <pre className="mt-3 bg-black text-white p-4 text-[13px] font-mono overflow-auto">{`# download lenear-win-x64.exe from GitHub Releases and add to PATH
lenear --help
lenear doctor
lenear init
lenear config set nvidiaApiKey <key>   # or groqApiKey
lenear auth login                      # Email link via Resend
lenear project create my-app
lenear pull                            # arrows to select
lenear review .                        # staged+unstaged, warns on untracked
`}</pre>

          <h2 id="commands" className="mt-10 text-[18px] font-semibold">Commands</h2>
          <div className="mt-4 border border-[#172A42]/15 divide-y">
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear init [--force]</code>
              <span className="text-[13px] text-[#8B9AB0]">Create .lenearrc + pre-push hook (threshold from config). Global token expiry via LENEAR_TOKEN_EXPIRY_HOURS (default 24h).</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear auth login|logout|status|whoami</code>
              <span className="text-[13px] text-[#8B9AB0]">login opens browser to /auth/cli, stores token in ~/.lenear/config.json (Email/Resend). status shows expiry.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear config set &lt;key&gt; &lt;value&gt;</code>
              <span className="text-[13px] text-[#8B9AB0]">Keys: provider (nvidia|groq), model, maxDiffLines, language, projectId, threshold, nvidiaApiKey, groqApiKey (global).</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear config get &lt;key&gt; | list</code>
              <span className="text-[13px] text-[#8B9AB0]">Read config; list shows .lenearrc + global provider/token.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear project create &lt;name&gt; [--desc]</code>
              <span className="text-[13px] text-[#8B9AB0]">Create project (requires auth). Auto-selects.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear project list</code>
              <span className="text-[13px] text-[#8B9AB0]">List owner projects.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear pull</code>
              <span className="text-[13px] text-[#8B9AB0]">Fetch owner projects, arrow-key select ( @clack/prompts ), writes .lenearrc projectId + global lastProjectId.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear review [files...] [--json] [--fail-under n] [--model]</code>
              <span className="text-[13px] text-[#8B9AB0]">.: staged+unstaged; staged/unstaged keywords; app.ts server.ts for multi-file. Warns on untracked.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear models [--provider]</code>
              <span className="text-[13px] text-[#8B9AB0]">List models for provider.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear doctor</code>
              <span className="text-[13px] text-[#8B9AB0]">Checks git, config, API key, hook, auth.</span>
            </div>
            <div className="p-4 grid md:grid-cols-[220px_1fr] gap-3">
              <code className="text-[13px] font-mono">lenear --help / --version</code>
              <span className="text-[13px] text-[#8B9AB0]">Commander help.</span>
            </div>
          </div>

          <h2 id="review" className="mt-10 text-[18px] font-semibold">Review semantics</h2>
          <ul className="mt-3 list-disc pl-5 text-[13px] leading-6 text-[#8B9AB0]">
            <li>
              <code>lenear review .</code> — staged+unstaged (<code>git diff HEAD</code>), with untracked warning (stage to include).
            </li>
            <li>
              <code>lenear review staged</code> — <code>git diff --staged</code>
            </li>
            <li>
              <code>lenear review unstaged</code> — <code>git diff</code>
            </li>
            <li>
              <code>lenear review app.ts server.ts</code> — <code>git diff HEAD -- files</code>
            </li>
            <li>
              <code>--full</code> — <code>HEAD~1..HEAD</code>, <code>--json</code> for CI, <code>--fail-under 70</code> exits 2.
            </li>
          </ul>

          <h2 id="config" className="mt-10 text-[18px] font-semibold">Config</h2>
          <p className="mt-2 text-[13px] text-[#8B9AB0]">Local <code>.lenearrc</code> + global <code>~/.lenear/config.json</code>. Env <code>LENEAR_TOKEN_EXPIRY_HOURS</code> controls token TTL.</p>

          <h2 id="auth" className="mt-10 text-[18px] font-semibold">Auth & Projects</h2>
          <p className="mt-2 text-[13px] text-[#8B9AB0]">After <code>lenear init</code> you must <code>lenear auth login</code> (Email link via Resend, Auth.js). Then <code>lenear project create</code> and <code>lenear pull</code> to bind reviews to a workspace. Reviews POST to <code>/api/reviews</code> when authed.</p>

          <h2 id="dashboard" className="mt-10 text-[18px] font-semibold">Dashboard</h2>
          <p className="mt-2 text-[13px] text-[#8B9AB0]">
            Black + light lime <code>#DFF57A</code> (pops in dark). History shows score, summary, severity counts, full payload. Conversation stub for v2 T-REX.
          </p>

          <h2 id="troubleshoot" className="mt-10 text-[18px] font-semibold">Troubleshoot</h2>
          <p className="mt-2 text-[13px] text-[#8B9AB0]">
            Run <code>lenear doctor</code>. Missing key → <code>lenear config set nvidiaApiKey</code>. Backend not configured → set{" "}
            <code>DATABASE_URL</code>/<code>AUTH_SECRET</code> in web/.env and Vercel. See <Link href="/cli" className="text-[#0B1F3A] underline">CLI page</Link>.
          </p>

          <div className="mt-8 p-4 bg-black text-white text-[12px]">Goal: OSS rival to CodeRabbit & Greptile — local-first, dashboard history, v2 T-REX sandbox.</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
