export function ValueProp() {
  return (
    <section className="bg-[#050B14] text-white py-14 md:py-20">
      <div className="mx-auto max-w-[1160px] px-6">
        <div className="max-w-[560px]">
          <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">Why Lenear</div>
          <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold leading-tight">Catch problems earlier. Understand them faster.</h2>
          <p className="mt-3 text-[15px] leading-6 text-[#8B9AB0]">Review code before the rest of the team has to. Smaller fixes, fewer surprises.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="bg-[#0A1424] border border-[#172A42] p-6">
            <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">01</div>
            <h3 className="mt-3 text-[16px] font-medium">Catch issues</h3>
            <p className="mt-2 text-[14px] leading-6 text-[#8B9AB0]">Bugs, security risks, and risky patterns surfaced before review comments.</p>
          </div>
          <div className="bg-[#0A1424] border border-[#172A42] p-6">
            <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">02</div>
            <h3 className="mt-3 text-[16px] font-medium">Understand</h3>
            <p className="mt-2 text-[14px] leading-6 text-[#8B9AB0]">What is wrong, why it matters, where it happens, what to change.</p>
          </div>
          <div className="bg-[#0A1424] border border-[#172A42] p-6">
            <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">03</div>
            <h3 className="mt-3 text-[16px] font-medium">Ship with confidence</h3>
            <p className="mt-2 text-[14px] leading-6 text-[#8B9AB0]">Push after Lenear, not after a late reviewer finds it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
