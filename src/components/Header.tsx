"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { navigation } from "@/data/site-content";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/95 text-white shadow-lg backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-4 px-4 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral">
          <Logo compact />
          <span className="hidden text-sm font-black uppercase leading-tight tracking-wide sm:block">EDR Nord<br />Toulousain</span>
        </Link>
        <nav aria-label="Navigation principale" className="ml-auto hidden items-center 2xl:flex">
          {navigation.map((item) => (
            <div key={item.href} className="group relative">
              <Link href={item.href} className="block rounded-lg px-2.5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:outline-none">
                {item.label}
              </Link>
              {"children" in item && item.children && (
                <div className="invisible absolute left-0 top-full min-w-52 translate-y-2 rounded-xl border border-slate-200 bg-white p-2 text-ink opacity-0 shadow-card transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {item.children.map((child) => <Link key={child.href} href={child.href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-mist hover:text-blue">{child.label}</Link>)}
                </div>
              )}
            </div>
          ))}
        </nav>
        <Link href="/contact" className="ml-auto hidden rounded-full bg-red px-5 py-3 text-sm font-bold transition hover:bg-coral focus:outline-none focus:ring-2 focus:ring-white sm:inline-flex 2xl:ml-3">Nous contacter</Link>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} className="ml-auto grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-2xl 2xl:hidden">
          {open ? "×" : "☰"}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Navigation mobile" className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/10 px-4 py-4 2xl:hidden">
          {navigation.map((item) => "children" in item && item.children ? (
            <details key={item.href} className="border-b border-white/10 py-1">
              <summary className="cursor-pointer py-3 font-bold">{item.label}</summary>
              <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-white/75">Vue d’ensemble</Link>
              {item.children.map((child) => <Link key={child.href} href={child.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-white/75">{child.label}</Link>)}
            </details>
          ) : <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block border-b border-white/10 py-3 font-bold">{item.label}</Link>)}
          <Link href="/contact" onClick={() => setOpen(false)} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-red font-bold">Nous contacter</Link>
        </nav>
      )}
    </header>
  );
}
