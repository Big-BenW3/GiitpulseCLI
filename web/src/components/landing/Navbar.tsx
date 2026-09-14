"use client";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#172A42]/10">
      <div className="mx-auto max-w-[1160px] px-6 h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-[20px] font-semibold tracking-tight text-[#0B1F3A]">
            lenear
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[14px]">
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 py-2 text-[#0B1F3A] hover:text-black"
              >
                Product
                <span className="text-[11px] translate-y-[1px]">{open ? "▴" : "▾"}</span>
              </button>
              {open && (
                <div className="absolute left-0 top-[40px] w-[360px] bg-white border border-[#172A42]/15 p-2">
                  <Link
                    href="/cli"
                    onClick={() => setOpen(false)}
                    className="flex flex-col p-3 hover:bg-[#0A1424]/5"
                  >
                    <span className="text-[13px] font-medium text-[#0B1F3A]">CLI</span>
                    <span className="text-[13px] text-[#8B9AB0]">Run reviews directly from your terminal.</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex flex-col p-3 hover:bg-[#0A1424]/5"
                  >
                    <span className="text-[13px] font-medium text-[#0B1F3A]">Dashboard</span>
                    <span className="text-[13px] text-[#8B9AB0]">Track reviews, findings, and history.</span>
                  </Link>
                  <Link
                    href="/docs"
                    onClick={() => setOpen(false)}
                    className="flex flex-col p-3 hover:bg-[#0A1424]/5"
                  >
                    <span className="text-[13px] font-medium text-[#0B1F3A]">Documentation</span>
                    <span className="text-[13px] text-[#8B9AB0]">Learn how to install and use Lenear.</span>
                  </Link>
                </div>
              )}
            </div>
            <a href="#how" className="text-[#0B1F3A]/70 hover:text-[#0B1F3A]">
              How it works
            </a>
            <a href="#resources" className="text-[#0B1F3A]/70 hover:text-[#0B1F3A]">
              Resources
            </a>
            <Link href="/docs" className="text-[#0B1F3A]/70 hover:text-[#0B1F3A]">
              About
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth" className="text-[14px] px-4 py-2 text-[#0B1F3A]/80 hover:text-[#0B1F3A]">
            Log in
          </Link>
          <Link
            href="/cli"
            className="text-[14px] font-medium bg-[#0B1F3A] text-white px-5 py-2.5 hover:bg-[#0A1424]"
          >
            Get started
          </Link>
        </div>

        <button
          onClick={() => setMobile((v) => !v)}
          className="md:hidden p-2 text-[#0B1F3A]"
          aria-label="Menu"
        >
          <span className="text-[20px]">{mobile ? "×" : "≡"}</span>
        </button>
      </div>

      {mobile && (
        <div className="md:hidden border-t border-[#172A42]/10 bg-white px-6 py-4 space-y-3">
          <Link href="/cli" className="block py-2 text-[14px]">CLI</Link>
          <Link href="/dashboard" className="block py-2 text-[14px]">Dashboard</Link>
          <Link href="/docs" className="block py-2 text-[14px]">Documentation</Link>
          <a href="#how" className="block py-2 text-[14px]">How it works</a>
          <div className="pt-3 flex gap-3">
            <Link href="/auth" className="flex-1 text-center border border-[#172A42]/15 py-2.5 text-[14px]">
              Log in
            </Link>
            <Link href="/cli" className="flex-1 text-center bg-[#0B1F3A] text-white py-2.5 text-[14px]">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
