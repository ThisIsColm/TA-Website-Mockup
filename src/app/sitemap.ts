import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemapUrls";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return getSitemapEntries();
}
