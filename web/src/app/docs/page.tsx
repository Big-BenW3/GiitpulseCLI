import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-[1160px] px-6 py-10 w-full grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden md:block border-r border-[#172A42]/10 pr-6 text-[13px]">
          <div className="font-medium">Docs</div>
          <div className="mt-4 space-y-2 text-[#8B9AB0]">
            <div className="text-[#0B1F3A]">Getting started</div>
            <div>CLI</div>
            <div>Auth</div>
            <div>Projects</div>
            <div>faq</div>
          </div>
          <div className="mt-6 text-[12px] text-[#8B9AB0]">Full docs after CLI v1 release. This is a stub.</div>
        </aside>
        <div>
          <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">Documentation</div>
          <h1 className="mt-2 text-[28px] font-semibold">Lenear docs — stub</h1>
          <p className="mt-3 text-[14px] text-[#8B9AB0]">Comprehensive docs will replace this after the CLI first release. Current commands:</p>
          <pre className="mt-6 bg-[#050B14] text-white p-4 text-[13px] font-mono overflow-auto">{`lenear init
lenear auth login | logout | status
lenear config set provider nvidia|groq
lenear config set nvidiaApiKey <key>
lenear config set groqApiKey <key>
lenear project create <name>
lenear pull                # interactive select
lenear review .            # staged+unstaged
lenear review staged
lenear review unstaged
lenear review app.ts server.ts
lenear models
lenear doctor
lenear --help
`}</pre>
        </div>
      </main>
      <Footer />
    </div>
  );
}
