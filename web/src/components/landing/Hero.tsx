import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-white border-b border-[#172A42]/10">
      <div className="mx-auto max-w-[1160px] px-6 py-14 md:py-20 grid md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div>
          <h1 className="text-[42px] md:text-[56px] font-semibold leading-[0.95] tracking-tight text-[#0B1F3A]">
            Catch it <br />
            before they do.
          </h1>
          <p className="mt-5 max-w-[480px] text-[16px] md:text-[18px] leading-7 text-[#8B9AB0]">
            AI code review built for developers who want to catch bugs, security issues, and risky changes
            before they ship.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cli" className="bg-[#0B1F3A] text-white px-6 py-3 text-[14px] font-medium hover:bg-[#0A1424]">
              Get started
            </Link>
            <Link
              href="/docs"
              className="border border-[#172A42]/15 px-6 py-3 text-[14px] font-medium text-[#0B1F3A] hover:bg-[#0A1424]/5"
            >
              View documentation
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <code className="bg-[#050B14] text-white px-3 py-2 text-[13px] font-mono">lenear review .</code>
            <span className="text-[13px] text-[#8B9AB0]">From your terminal. No setup.</span>
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-[#172A42]/10 pt-6">
            <span className="text-[12px] tracking-wide text-[#8B9AB0] uppercase">Trusted workflow</span>
            <span className="text-[13px] text-[#0B1F3A]/60">CLI · Dashboard · Docs</span>
          </div>
        </div>

        <div className="bg-[#050B14] border border-[#172A42] p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#172A42]">
            <span className="text-[12px] font-mono text-[#8B9AB0]">lenear review .</span>
            <span className="text-[11px] px-2 py-1 bg-[#0A1424] border border-[#172A42] text-[#8B9AB0]">3 issues found</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="border border-[#172A42] bg-[#0A1424] p-4">
              <div className="text-[11px] tracking-wide text-[#8B9AB0]">HIGH</div>
              <div className="text-[14px] font-medium text-white mt-1">SQL injection risk</div>
              <div className="text-[13px] font-mono text-[#8B9AB0] mt-1">src/api/users.ts:84</div>
              <div className="text-[13px] text-[#8B9AB0] mt-2">Query built with string concatenation. Use parameterized queries.</div>
            </div>
            <div className="border border-[#172A42] bg-[#0A1424] p-4">
              <div className="text-[11px] tracking-wide text-[#8B9AB0]">MEDIUM</div>
              <div className="text-[14px] font-medium text-white mt-1">Unhandled promise rejection</div>
              <div className="text-[13px] font-mono text-[#8B9AB0] mt-1">src/auth/service.ts:129</div>
            </div>
            <div className="border border-[#172A42] bg-[#0A1424] p-4 opacity-80">
              <div className="text-[11px] tracking-wide text-[#8B9AB0]">LOW</div>
              <div className="text-[14px] font-medium text-white mt-1">Unnecessary database query</div>
              <div className="text-[13px] font-mono text-[#8B9AB0] mt-1">src/db/queries.ts:42</div>
            </div>
          </div>
          <div className="px-4 py-3 bg-[#0A1424] border-t border-[#172A42] flex items-center justify-between">
            <span className="text-[12px] text-[#8B9AB0]">Score 82/100</span>
            <span className="text-[12px] text-white">Fix before push</span>
          </div>
        </div>
      </div>
    </section>
  );
}
