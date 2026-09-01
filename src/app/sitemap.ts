import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles } from "@/lib/articles";
import { getAllGlossaryEntries } from "@/lib/glossary";

export default function sitemap(): MetadataRoute.Sitemap {
    const articles = getAllArticles();
    const glossaryEntries = getAllGlossaryEntries();

    return [
        {
            url: siteConfig.url,
            lastModified: new Date(),
        },
        {
            url: `${siteConfig.url}/articles`,
            lastModified: new Date(),
        },
        ...articles.map((article) => ({
            url: `${siteConfig.url}/articles/${article.slug}`,
            lastModified: article.updatedAt ?? article.publishedAt,
        })),
        {
            url: `${siteConfig.url}/glossary`,
            lastModified: new Date(),
        },
        ...glossaryEntries.map((entry) => ({
            url: `${siteConfig.url}/glossary/${entry.slug}`,
            lastModified: new Date(),
        })),
        {
            url: `${siteConfig.url}/videos`,
            lastModified: new Date(),
        },
        {
            url: `${siteConfig.url}/profile`,
            lastModified: new Date(),
        },
    ];
}
