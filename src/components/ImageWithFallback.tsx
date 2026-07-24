"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  placeholder: string;
  note?: string;
  className?: string;
  objectFit?: "cover" | "contain";
  background?: "dark" | "light";
};

export function ImageWithFallback({ src, alt, placeholder, note, className = "", objectFit = "cover", background = "dark" }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${background === "light" ? "bg-white" : "bg-night"} ${className}`}>
      {!failed && (
        // Une balise img permet d’activer proprement le fallback lorsqu’un futur fichier est absent.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full ${objectFit === "contain" ? "object-contain p-3" : "object-cover"}`}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <div className="field-lines absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-night via-blue to-red px-6 text-center text-white">
          <strong className="text-xl font-black tracking-[.12em] sm:text-3xl">{placeholder}</strong>
          {note && <span className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">{note}</span>}
        </div>
      )}
    </div>
  );
}
