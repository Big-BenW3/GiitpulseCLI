export function Comparison() {
  return (
    <section className="bg-white py-14 md:py-20 border-t border-[#172A42]/10">
      <div className="mx-auto max-w-[1160px] px-6">
        <div className="grid md:grid-cols-2 gap-0 border border-[#172A42]/15 overflow-hidden">
          <div className="p-8 bg-white">
            <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">Traditional review</div>
            <h3 className="mt-3 text-[18px] font-medium text-[#0B1F3A]">Slow feedback, late surprise</h3>
            <div className="mt-4 space-y-2 text-[14px] leading-6 text-[#0B1F3A]/60">
              <div>Write → Push → Wait → Reviewer finds issue → Context switch → Fix → Repeat</div>
              <ul className="list-disc pl-5">
                <li>Reviewer-dependent</li>
                <li>Issues found late</li>
                <li>Repeated cycles</li>
              </ul>
            </div>
          </div>
          <div className="p-8 bg-[#0B1F3A] text-white md:border-l border-t md:border-t-0 border-[#172A42]/15">
            <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">With Lenear</div>
            <h3 className="mt-3 text-[18px] font-medium">Immediate, always available</h3>
            <div className="mt-4 space-y-2 text-[14px] leading-6 text-[#8B9AB0]">
              <div>Write → lenear review . → Issues surfaced → Understand → Fix → Push</div>
              <ul className="list-disc pl-5 text-white">
                <li>Immediate feedback</li>
                <li>Developer-controlled</li>
                <li>Cleaner cycles</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center text-[12px] text-[#8B9AB0]">Lenear flows into your existing git workflow — not around it.</div>
      </div>
    </section>
  );
}
