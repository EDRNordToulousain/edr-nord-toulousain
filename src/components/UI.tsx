import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-6 ${className}`}>{children}</div>;
}

export function PageHero({ eyebrow = "EDR Nord Toulousain", title, text }: { eyebrow?: string; title: string; text?: string }) {
  return <section className="field-lines relative overflow-hidden bg-night py-16 text-white sm:py-24"><Container><p className="font-bold uppercase tracking-[.2em] text-coral">{eyebrow}</p><h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{title}</h1>{text && <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{text}</p>}</Container></section>;
}

export function SectionTitle({ kicker, children, center = false }: { kicker?: string; children: ReactNode; center?: boolean }) {
  return <div className={center ? "text-center" : ""}>{kicker && <p className="text-sm font-black uppercase tracking-[.18em] text-red">{kicker}</p>}<h2 className="mt-2 text-3xl font-black tracking-tight text-night sm:text-4xl">{children}</h2></div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-card ${className}`}>{children}</article>;
}

export function Button({ href, children, variant = "red" }: { href: string; children: ReactNode; variant?: "red" | "blue" | "light" }) {
  const colors = variant === "red" ? "bg-red text-white hover:bg-coral" : variant === "blue" ? "bg-blue text-white hover:bg-night" : "bg-white text-night hover:bg-mist";
  return <Link href={href} className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-center font-bold transition focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 ${colors}`}>{children}<span aria-hidden="true" className="ml-2">→</span></Link>;
}

export function InfoGrid({ items }: { items: readonly (readonly [string, string])[] }) {
  return <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(([label, value]) => <div key={label} className="rounded-2xl bg-mist p-5"><dt className="text-xs font-black uppercase tracking-wider text-blue">{label}</dt><dd className="mt-2 text-lg font-bold text-night">{value}</dd></div>)}</dl>;
}
