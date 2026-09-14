import Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-[#050B14] border-t border-[#172A42] py-10">
      <div className="mx-auto max-w-[1160px] px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-white font-semibold">lenear</div>
          <div className="text-[13px] text-[#8B9AB0] mt-1">Catch it before they do.</div>
          <div className="text-[12px] text-[#8B9AB0]/60 mt-4">© Lenear</div>
        </div>
        <div>
          <div className="text-[12px] tracking-wide text-[#8B9AB0] uppercase">Product</div>
          <div className="mt-3 space-y-2 text-[13px] text-[#8B9AB0]">
            <Link href="/cli" className="block hover:text-white">CLI</Link>
            <Link href="/dashboard" className="block hover:text-white">Dashboard</Link>
          </div>
        </div>
        <div>
          <div className="text-[12px] tracking-wide text-[#8B9AB0] uppercase">Resources</div>
          <div className="mt-3 space-y-2 text-[13px] text-[#8B9AB0]">
            <Link href="/docs" className="block hover:text-white">Documentation</Link>
            <a href="https://github.com/Ben-W3cloud/GiitpulseCLI" className="block hover:text-white">GitHub</a>
          </div>
        </div>
        <div>
          <div className="text-[12px] tracking-wide text-[#8B9AB0] uppercase">Company</div>
          <div className="mt-3 space-y-2 text-[13px] text-[#8B9AB0]">
            <Link href="/docs" className="block hover:text-white">About</Link>
            <a href="mailto:hello@lenear.app" className="block hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
