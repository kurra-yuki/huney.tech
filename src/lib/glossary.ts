import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { GlossaryEntry, GlossaryFrontmatter } from "@/types/glossary";

const glossaryDirectory = path.join(process.cwd(), "content/glossary");
const supportedExtensions = new Set([".md", ".mdx"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isIndexFile(filePath: string) {
    const fileName = path.basename(filePath).toLowerCase();
    return fileName === "00_index.md" || fileName === "index.md";
}

function validateFrontmatter(data: Record<string, unknown>, fileName: string): asserts data is GlossaryFrontmatter {
    const errors: string[] = [];

    if (typeof data.term !== "string" || !data.term.trim()) errors.push("term");
    if (typeof data.slug !== "string" || !slugPattern.test(data.slug)) errors.push("slug");
    if (typeof data.summary !== "string" || !data.summary.trim()) errors.push("summary");
    if (typeof data.category !== "string" || !data.category.trim()) errors.push("category");
    if (typeof data.draft !== "boolean") errors.push("draft");
    if (data.relatedTerms !== undefined && (!Array.isArray(data.relatedTerms) || data.relatedTerms.some((slug) => typeof slug !== "string"))) errors.push("relatedTerms");
    if (data.relatedArticles !== undefined && (!Array.isArray(data.relatedArticles) || data.relatedArticles.some((slug) => typeof slug !== "string"))) errors.push("relatedArticles");

    if (errors.length > 0) {
        throw new Error(`用語 ${fileName} のfrontmatterが不正です: ${errors.join(", ")}`);
    }
}

function getGlossaryFiles(dir = glossaryDirectory): string[] {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return getGlossaryFiles(fullPath);
        }

        if (entry.isFile() && supportedExtensions.has(path.extname(entry.name)) && !isIndexFile(fullPath)) {
            return [fullPath];
        }

        return [];
    });
}

function readEntry(filePath: string): GlossaryEntry {
    const source = fs.readFileSync(filePath, "utf8");
    const parsed = matter(source);
    validateFrontmatter(parsed.data, path.basename(filePath));
    return { ...parsed.data, content: parsed.content };
}

export function getAllGlossaryEntries() {
    const slugs = new Set<string>();
    const entries = getGlossaryFiles().flatMap((filePath) => {
        const entry = readEntry(filePath);
        if (slugs.has(entry.slug)) throw new Error(`用語slugが重複しています: ${entry.slug}`);
        slugs.add(entry.slug);
        return entry.draft ? [] : [entry];
    });

    return entries.sort((a, b) => a.term.localeCompare(b.term, "ja"));
}

export function getGlossaryBySlug(slug: string) {
    const filePath = getGlossaryFiles().find((candidate) => {
        const entry = readEntry(candidate);
        return entry.slug === slug;
    });

    if (!filePath) return null;
    const entry = readEntry(filePath);
    return entry.draft ? null : entry;
}
