import { getAllArticles } from "@/lib/articles";
import { getAllGlossaryEntries } from "@/lib/glossary";

function normalize(value: string) {
    return value.trim().toLocaleLowerCase("ja-JP");
}

export function searchContent(query: string) {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return { articles: [], glossary: [] };

    const articles = getAllArticles().filter((article) => {
        const searchableText = [article.title, article.description, article.category, ...(article.tags ?? [])].join(" ");
        return normalize(searchableText).includes(normalizedQuery);
    });

    const glossary = getAllGlossaryEntries().filter((entry) => {
        const searchableText = [entry.term, entry.summary, entry.officialName ?? "", entry.category].join(" ");
        return normalize(searchableText).includes(normalizedQuery);
    });

    return { articles, glossary };
}
