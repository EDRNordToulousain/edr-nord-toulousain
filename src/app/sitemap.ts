import type { MetadataRoute } from "next";
import { allPaths, site } from "@/data/site-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.canonicalUrl;
  return ["/", ...allPaths].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : 0.7 }));
}
