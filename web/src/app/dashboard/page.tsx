import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-[#050B14] text-white">
      <aside className="w-[260px] border-r border-[#172A42] hidden md:flex flex-col">
        <div className="px-5 py-4 border-b border-[#172A42] font-semibold">lenear</div>
        <div className="p-3 space-y-1 text-[13px]">
          <div className="bg-[#0A1424] border border-[#172A42] px-3 py-2">Reviews</div>
          <div className="px-3 py-2 text-[#8B9AB0]">Projects</div>
          <div className="px-3 py-2 text-[#8B9AB0]">Settings</div>
        </div>
        <div className="mt-auto p-4 border-t border-[#172A42] text-[12px] text-[#8B9AB0]">ChatGPT-style shell — stub</div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-[56px] border-b border-[#172A42] flex items-center justify-between px-4 md:px-6">
          <span className="text-[14px]">Dashboard</span>
          <Link href="/cli" className="bg-white text-[#0B1F3A] px-4 py-2 text-[13px]">Open CLI docs</Link>
        </header>
        <div className="flex-1 grid md:grid-cols-[1fr_320px]">
          <div className="p-6 md:p-8 overflow-auto">
            <div className="max-w-[720px] mx-auto space-y-4">
              <div className="bg-[#0A1424] border border-[#172A42] p-4">
                <div className="text-[11px] tracking-wide text-[#8B9AB0]">HIGH — src/api/users.ts:84</div>
                <div className="text-[14px] mt-1">SQL injection risk</div>
                <div className="text-[13px] text-[#8B9AB0] mt-1">Parameterized queries needed. See lenear review.</div>
              </div>
              <div className="bg-[#0A1424] border border-[#172A42] p-4">
                <div className="text-[13px]">Conversation — ask Lenear about this diff (stub)</div>
                <div className="mt-3 flex gap-2">
                  <input placeholder="Ask about this review..." className="flex-1 bg-[#050B14] border border-[#172A42] px-3 py-2 text-[13px] placeholder:text-[#8B9AB0]" />
                  <button className="bg-white text-[#0B1F3A] px-4 py-2 text-[13px]">Send</button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-l border-[#172A42] bg-[#0A1424] p-5 hidden md:block">
            <div className="text-[11px] tracking-wide text-[#8B9AB0]">History</div>
            <div className="mt-3 space-y-2 text-[13px]">
              <div className="border border-[#172A42] p-3">Review #42 — 87/100</div>
              <div className="border border-[#172A42] p-3 opacity-60">Review #41 — 72/100</div>
            </div>
            <div className="mt-6 text-[12px] text-[#8B9AB0]">Resend placeholder: notifications for critical findings will be mailed via Resend.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
