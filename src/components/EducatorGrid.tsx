import type { Educator } from "@/data/site-content";
import { ImageWithFallback } from "./ImageWithFallback";

export function EducatorGrid({ educators }: { educators: readonly Educator[] }) {
  return (
    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {educators.map((educator) => (
        <article key={educator.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ImageWithFallback
            src={educator.image ?? `/images/educators/${educator.name.toLowerCase().replaceAll(" ", "-")}.jpg`}
            alt={educator.image ? `Portrait de ${educator.name}` : ""}
            placeholder="Photo à venir"
            className="aspect-square"
          />
          <div className="p-5">
            <h3 className="text-lg font-black text-night">{educator.pendingLabel ?? educator.name}</h3>
            {educator.categoryContact && <p className="mt-2 text-sm font-bold text-red">Contact de la catégorie</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
