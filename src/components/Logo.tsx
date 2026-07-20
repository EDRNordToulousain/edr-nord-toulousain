"use client";

import { useState } from "react";

export function Logo({ compact = false }: { compact?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`grid shrink-0 place-items-center rounded-xl border-2 border-white/30 bg-white/10 text-center font-black leading-none text-white ${compact ? "h-12 w-16 text-[8px]" : "h-20 w-28 text-[10px]"}`}>
        EDR<br />NORD<br />TOULOUSAIN
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/images/logo-edr.png" alt="Logo officiel de l’EDR Nord Toulousain" onError={() => setFailed(true)} className={`${compact ? "h-12 w-16" : "h-20 w-28"} shrink-0 rounded-xl bg-white object-contain p-1`} />;
}
