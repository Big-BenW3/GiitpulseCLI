import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-[1160px] px-6 py-14 w-full grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">Auth</div>
          <h1 className="mt-2 text-[28px] font-semibold text-[#0B1F3A]">Log in to Lenear.</h1>
          <p className="mt-3 text-[14px] text-[#8B9AB0]">Auth.js + Neon. CLI login opens this page via lenear auth login.</p>
          <div className="mt-6 space-y-3">
            <button className="w-full bg-[#0B1F3A] text-white py-3 text-[14px]">Continue with GitHub (stub)</button>
            <button className="w-full border border-[#172A42]/15 py-3 text-[14px]">Continue with Email (stub)</button>
          </div>
          <p className="mt-4 text-[12px] text-[#8B9AB0]">Resend integration placeholder — transactional emails (login, project invites) will use Resend once configured.</p>
        </div>
        <div className="border border-[#172A42]/15 p-6 bg-[#050B14] text-white">
          <div className="font-mono text-[13px] text-[#8B9AB0]">$ lenear auth login</div>
          <div className="mt-3 text-[13px] text-[#8B9AB0]">Opens https://lenear.vercel.app/auth/cli — device code flow — token stored in ~/.lenear/config.json (1-day, LENEAR_TOKEN_EXPIRY_HOURS).</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
