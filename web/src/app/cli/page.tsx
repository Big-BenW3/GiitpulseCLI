import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function CLIPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-[1160px] px-6 py-10 w-full">
        <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">CLI</div>
        <h1 className="mt-2 text-[28px] font-semibold text-[#0B1F3A]">Install and run Lenear from your terminal.</h1>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border border-[#172A42]/15 p-6">
            <h2 className="text-[14px] font-medium">Windows (standalone)</h2>
            <p className="mt-2 text-[13px] text-[#8B9AB0]">Download the exe — no Node required.</p>
            <div className="mt-4 bg-[#050B14] text-white p-3 font-mono text-[13px]">lenear-win-x64.exe — coming with v1 release</div>
            <a href="#" className="mt-3 inline-block bg-[#0B1F3A] text-white px-4 py-2 text-[13px]">Download</a>
          </div>
          <div className="border border-[#172A42]/15 p-6">
            <h2 className="text-[14px] font-medium">npm (global)</h2>
            <div className="mt-3 bg-[#050B14] text-white p-3 font-mono text-[13px]">npm i -g lenear</div>
            <p className="mt-2 text-[13px] text-[#8B9AB0]">Requires Node 20+.</p>
          </div>
        </div>

        <div className="mt-8 border border-[#172A42]/15">
          <div className="p-6">
            <h2 className="text-[16px] font-medium">Quick start</h2>
            <div className="mt-4 space-y-3 font-mono text-[13px]">
              <div className="bg-[#0A1424] text-white p-3">lenear init</div>
              <div className="bg-[#0A1424] text-white p-3">lenear config set nvidiaApiKey &lt;key&gt;</div>
              <div className="bg-[#0A1424] text-white p-3">lenear auth login</div>
              <div className="bg-[#0A1424] text-white p-3">lenear project create my-app</div>
              <div className="bg-[#0A1424] text-white p-3">lenear pull</div>
              <div className="bg-[#0A1424] text-white p-3">lenear review .</div>
              <div className="bg-[#0A1424] text-white p-3">lenear review staged — or — lenear review app.ts server.ts</div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-[13px]">
          <div className="border border-[#172A42]/15 p-5"><div className="font-medium">lenear review .</div><div className="text-[#8B9AB0] mt-1">staged + unstaged</div></div>
          <div className="border border-[#172A42]/15 p-5"><div className="font-medium">lenear review staged</div><div className="text-[#8B9AB0] mt-1">only staged</div></div>
          <div className="border border-[#172A42]/15 p-5"><div className="font-medium">lenear doctor</div><div className="text-[#8B9AB0] mt-1">diagnose setup</div></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
