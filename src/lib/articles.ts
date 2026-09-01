import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ArticleDetail, ArticleFrontmatter, ArticleSummary } from "@/types/article";

const articlesDirectory = path.join(process.cwd(), "content/articles");
const supportedExtensions = new Set([".md", ".mdx"]);

function isIndexFile(filePath: string) {
    const fileName = path.basename(filePath).toLowerCase();
    return fileName === "00_index.md" || fileName === "index.md";
}

function isValidFrontmatter(data: Record<string, unknown>): data is ArticleFrontmatter {
    return (
        typeof data.title === "string" &&
        typeof data.slug === "string" &&
        typeof data.description === "string" &&
        typeof data.publishedAt === "string" &&
        typeof data.category === "string" &&
        typeof data.draft === "boolean" &&
        !Number.isNaN(Date.parse(data.publishedAt))
    );
}

function validateFrontmatter(data: Record<string, unknown>, fileName: string) {
    const errors: string[] = [];

    if (typeof data.title !== "string" || !data.title.trim()) errors.push("title");
    if (typeof data.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) errors.push("slug");
    if (typeof data.description !== "string" || !data.description.trim()) errors.push("description");
    if (typeof data.publishedAt !== "string" || Number.isNaN(Date.parse(data.publishedAt))) errors.push("publishedAt");
    if (typeof data.category !== "string" || !data.category.trim()) errors.push("category");
    if (typeof data.draft !== "boolean") errors.push("draft");
    if (data.updatedAt !== undefined && (typeof data.updatedAt !== "string" || Number.isNaN(Date.parse(data.updatedAt)))) errors.push("updatedAt");
    if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string"))) errors.push("tags");
    if (data.relatedArticles !== undefined && (!Array.isArray(data.relatedArticles) || data.relatedArticles.some((slug) => typeof slug !== "string"))) errors.push("relatedArticles");

    if (errors.length > 0) {
        throw new Error(`記事 ${fileName} のfrontmatterが不正です: ${errors.join(", ")}`);
    }
}

function calculateReadingTime(content: string) {
    return Math.max(1, Math.ceil(content.replace(/\s/g, "").length / 500));
}

function getArticleFiles(dir = articlesDirectory): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return getArticleFiles(fullPath);
        }

        if (entry.isFile() && supportedExtensions.has(path.extname(entry.name)) && !isIndexFile(fullPath)) {
            return [fullPath];
        }

        return [];
    });
}

export function getAllArticles(): ArticleSummary[] {
    const files = getArticleFiles();
    const slugs = new Set<string>();
    const articles = files.flatMap((filePath) => {
        const source = fs.readFileSync(filePath, "utf8");
        const parsed = matter(source);
        const fileName = path.basename(filePath);

        validateFrontmatter(parsed.data, fileName);

        if (!isValidFrontmatter(parsed.data)) {
            return [];
        }

        if (slugs.has(parsed.data.slug)) {
            throw new Error(`記事slugが重複しています: ${parsed.data.slug}`);
        }
        slugs.add(parsed.data.slug);

        if (parsed.data.draft) return [];

        return [{
            ...parsed.data,
            readingTime: calculateReadingTime(parsed.content),
        }];
    });

    return articles.sort((a, b) => {
        const dateDifference = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
        return dateDifference || a.slug.localeCompare(b.slug);
    });
}

export function getLatestArticles(limit = 3): ArticleSummary[] {
    return getAllArticles().slice(0, limit);
}

export function getArticlesByCategory(category: string) {
    return getAllArticles().filter((article) => article.category === category);
}

export function getArticleBySlug(slug: string): ArticleDetail | null {
    const filePath = getArticleFiles().find((candidate) => {
        const source = fs.readFileSync(candidate, "utf8");
        const parsed = matter(source);
        return parsed.data.slug === slug;
    });

    if (!filePath) {
        return null;
    }

    const source = fs.readFileSync(filePath, "utf8");
    const parsed = matter(source);
    validateFrontmatter(parsed.data, path.basename(filePath));

    if (!isValidFrontmatter(parsed.data) || parsed.data.draft) {
        return null;
    }

    return {
        ...parsed.data,
        content: parsed.content,
        readingTime: calculateReadingTime(parsed.content),
    };
}
