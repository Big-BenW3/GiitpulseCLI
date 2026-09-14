export function About() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1160px] px-6">
        <div className="bg-white border border-[#172A42]/15 p-8 md:p-10">
          <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">About Lenear</div>
          <h2 className="mt-3 max-w-[720px] text-[22px] md:text-[26px] font-medium leading-snug text-[#0B1F3A]">
            Code review should not begin after someone finds the problem.
          </h2>
          <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-[#0B1F3A]/70">
            Lenear reviews your code before that happens. It runs alongside your development workflow, analyzes your
            changes, finds issues worth paying attention to, and explains what needs to be addressed. Whether you are
            reviewing a small change or an entire repository, Lenear gives you another pair of eyes before the code
            moves forward.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 border border-[#172A42]/15 text-[12px]">CLI</span>
            <span className="px-3 py-1.5 border border-[#172A42]/15 text-[12px]">Dashboard</span>
            <span className="px-3 py-1.5 border border-[#172A42]/15 text-[12px]">Nvidia + Groq</span>
          </div>
        </div>
      </div>
    </section>
  );
}
