import type { MetadataRoute } from "next";
import { allPaths } from "@/data/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://edr-nord-toulousain.vercel.app";
  return ["/", ...allPaths].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : 0.7 }));
}
