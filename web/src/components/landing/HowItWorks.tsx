"use client";

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#050B14] py-14 md:py-20">
      <div className="mx-auto max-w-[1160px] px-6">
        <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">How it works</div>
        <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold text-white">Four steps before you push.</h2>

        <div className="relative mt-10 md:h-[720px]">
          <div className="grid md:block gap-4">
            <div className="md:sticky md:top-[84px] bg-white border border-[#172A42]/10 p-6 md:p-8 md:mr-0">
              <div className="flex items-start justify-between">
                <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0]">01 — Connect your code</div>
                <span className="text-[11px] border border-[#172A42]/15 px-2 py-1">lenear init</span>
              </div>
              <h3 className="mt-3 text-[18px] font-medium text-[#0B1F3A]">Point Lenear at your project</h3>
              <p className="mt-2 text-[14px] leading-6 text-[#0B1F3A]/60">Initialize and set your provider and model.</p>
              <code className="mt-4 inline-block bg-[#050B14] text-white px-3 py-2 text-[13px] font-mono">lenear init</code>
            </div>

            <div className="md:sticky md:top-[104px] bg-[#0A1424] border border-[#172A42] p-6 md:p-8 md:mt-4">
              <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0]">02 — Lenear reviews it</div>
              <h3 className="mt-3 text-[18px] font-medium text-white">Analyzes the relevant changes</h3>
              <p className="mt-2 text-[14px] leading-6 text-[#8B9AB0]">Reads staged + unstaged diffs, explains findings by severity.</p>
              <code className="mt-4 inline-block bg-white text-[#0B1F3A] px-3 py-2 text-[13px] font-mono">lenear review .</code>
            </div>

            <div className="md:sticky md:top-[124px] bg-white border border-[#172A42]/10 p-6 md:p-8 md:mt-4">
              <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0]">03 — See what matters</div>
              <h3 className="mt-3 text-[18px] font-medium text-[#0B1F3A]">Severity, location, and action</h3>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <span className="border border-[#172A42]/15 py-2 text-[12px]">HIGH</span>
                <span className="border border-[#172A42]/15 py-2 text-[12px]">MEDIUM</span>
                <span className="border border-[#172A42]/15 py-2 text-[12px]">LOW</span>
              </div>
              <p className="mt-3 text-[13px] font-mono text-[#8B9AB0]">src/api/users.ts:84 — SQL injection risk</p>
            </div>

            <div className="md:sticky md:top-[144px] bg-[#0B1F3A] text-white p-6 md:p-8 md:mt-4">
              <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0]">04 — Fix before it ships</div>
              <h3 className="mt-3 text-[18px] font-medium">Push with confidence</h3>
              <p className="mt-2 text-[14px] leading-6 text-[#8B9AB0]">Fix with context before the next reviewer has to find it.</p>
              <div className="mt-4 text-[13px]">Score 87/100 — ready.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
