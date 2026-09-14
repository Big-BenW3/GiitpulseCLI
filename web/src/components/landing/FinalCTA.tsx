import Link from "next/link";
export function FinalCTA() {
  return (
    <section className="bg-white py-14 md:py-20 border-t border-[#172A42]/10">
      <div className="mx-auto max-w-[1160px] px-6 text-center">
        <h2 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[#0B1F3A]">Catch it before they do.</h2>
        <p className="mt-3 text-[15px] text-[#8B9AB0]">Give your code another pair of eyes before it reaches the next person in the chain.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/cli" className="bg-[#0B1F3A] text-white px-6 py-3 text-[14px] font-medium">Get started</Link>
          <Link href="/docs" className="border border-[#172A42]/15 px-6 py-3 text-[14px] font-medium text-[#0B1F3A]">Read the docs</Link>
        </div>
        <div className="mt-6 inline-block bg-[#050B14] text-white px-4 py-2 text-[13px] font-mono">lenear review .</div>
      </div>
    </section>
  );
}
