import { site } from "@/data/site-content";

type Props = {
  theme?: "light" | "dark";
  className?: string;
};

const linkClass = {
  light: "border-slate-200 bg-white text-night shadow-sm hover:border-blue hover:bg-mist",
  dark: "border-white/15 bg-white/10 text-white hover:bg-white/20",
};

export function SocialLinks({ theme = "light", className = "" }: Props) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href={site.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-12 items-center gap-3 rounded-full border px-4 py-2 font-bold transition ${linkClass[theme]}`}
        aria-label="Suivre l’EDR Nord Toulousain sur Facebook (nouvel onglet)"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1877F2]" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
            <path d="M14.5 8.25V6.5c0-.75.5-.92.86-.92H17.5V2.14L14.56 2C11.3 2 10.5 4.45 10.5 6v2.25H8v3.86h2.5V22h4v-9.89h2.73l.44-3.86H14.5Z" />
          </svg>
        </span>
        Facebook
      </a>
      <a
        href={site.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-12 items-center gap-3 rounded-full border px-4 py-2 font-bold transition ${linkClass[theme]}`}
        aria-label="Suivre l’EDR Nord Toulousain sur Instagram (nouvel onglet)"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white" strokeWidth="2">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" className="fill-white stroke-none" />
          </svg>
        </span>
        Instagram
      </a>
    </div>
  );
}
