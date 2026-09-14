"use client";
import { useState } from "react";

const items = [
  { q: "What is Lenear?", a: "Lenear is an AI code review tool that analyzes your changes to identify bugs, security issues, and risky patterns before they reach review or production. Run lenear review . from your terminal." },
  { q: "Does Lenear replace code review?", a: "No. It adds an early layer. Human review still handles architecture, product decisions, and context. Lenear catches the repeatable class of issues." },
  { q: "How do I use Lenear?", a: "Install the CLI, run lenear init, set provider/model, then lenear review . For unstaged files, use lenear review . — it warns on untracked files." },
  { q: "What languages does Lenear support?", a: "Bring your language hint via --language or .lenearrc language=typescript. The model will adapt; detailed support matrix in /docs." },
  { q: "Does Lenear modify my code?", a: "No auto-fix in v1. Lenear reports findings with suggestions only. Fix is manual — v1.1 will add opt-in fixes." },
  { q: "How does Lenear handle my code?", a: "Diffs are sent to your configured provider (Nvidia or Groq). No code is stored unless you opt into dashboard history. Self-hosted mode is on the roadmap." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-[#050B14] py-14 md:py-20">
      <div className="mx-auto max-w-[1160px] px-6">
        <div className="text-[11px] tracking-[0.14em] text-[#8B9AB0] uppercase">FAQ</div>
        <h2 className="mt-3 text-[28px] font-semibold text-white">Answers, no fluff.</h2>
        <div className="mt-8 divide-y divide-[#172A42]">
          {items.map((it, i) => (
            <div key={it.q} className="py-5">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left">
                <span className="text-[15px] font-medium text-white">{it.q}</span>
                <span className="text-[#8B9AB0] text-[14px]">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p className="mt-3 text-[14px] leading-6 text-[#8B9AB0]">{it.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
