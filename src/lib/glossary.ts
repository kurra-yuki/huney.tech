import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAllArticles } from "@/lib/articles";
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

function normalizeValue(value: string) {
    return value
        .toLowerCase()
        .replace(/[\s\-_]+/g, "")
        .replace(/[\p{P}\p{S}]+/gu, "");
}

function getGlossaryLookupEntries() {
    return getGlossaryFiles()
        .map((filePath) => {
            const entry = readEntry(filePath);
            return entry.draft ? null : entry;
        })
        .filter((entry): entry is GlossaryEntry => entry !== null);
}

function getSectionLinks(content: string, sectionTitle: "関連用語" | "関連記事"): string[] {
    const lines = content.split(/\r?\n/);
    let inSection = false;
    const slugs: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();

        if (/^##\s+/.test(trimmed)) {
            const title = trimmed.replace(/^##\s+/, "").trim();

            if (inSection && title !== sectionTitle) {
                break;
            }

            if (title === sectionTitle) {
                inSection = true;
                continue;
            }
        }

        if (!inSection) continue;

        const markdownLinkMatch = trimmed.match(/\[([^\]]+)\]\((\/+(?:articles|glossary)\/[^)]*)\)/);
        if (markdownLinkMatch) {
            const label = markdownLinkMatch[1];
            const href = markdownLinkMatch[2];
            const possibleSlug = href.split("/").filter(Boolean).at(-1);

            if (possibleSlug && possibleSlug !== "articles" && possibleSlug !== "glossary") {
                slugs.push(possibleSlug);
                continue;
            }

            const articleCandidates = getAllArticles();
            const glossaryCandidates = getGlossaryLookupEntries();
            const targetList = href.includes("/articles/") ? articleCandidates : glossaryCandidates;
            const normalizedLabel = normalizeValue(label);

            const matched = targetList.find((candidate) => {
                const candidateValue = "title" in candidate ? candidate.title : candidate.term;
                return normalizeValue(candidateValue).includes(normalizedLabel) || normalizedLabel.includes(normalizeValue(candidateValue));
            });

            if (matched) {
                slugs.push(matched.slug);
            }
            continue;
        }

        const slugMatch = trimmed.match(/\/+(?:articles|glossary)\/([a-z0-9]+(?:-[a-z0-9]+)*)/i);
        if (slugMatch) {
            slugs.push(slugMatch[1]);
        }
    }

    return [...new Set(slugs)];
}

function normalizeRelatedSlugs(values: string[] | undefined): string[] {
    const normalized = (values ?? []).filter((value) => typeof value === "string" && value.trim().length > 0);
    return [...new Set(normalized)];
}

export function resolveGlossaryRelationshipLinks(entry: GlossaryEntry) {
    const relatedTerms = normalizeRelatedSlugs([
        ...(entry.relatedTerms ?? []),
        ...getSectionLinks(entry.content, "関連用語"),
    ]);

    const relatedArticles = normalizeRelatedSlugs([
        ...(entry.relatedArticles ?? []),
        ...getSectionLinks(entry.content, "関連記事"),
    ]);

    return {
        relatedTerms,
        relatedArticles,
    };
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

    return entries
        .map((entry) => {
            const relationships = resolveGlossaryRelationshipLinks(entry);
            return {
                ...entry,
                relatedTerms: relationships.relatedTerms,
                relatedArticles: relationships.relatedArticles,
            };
        })
        .sort((a, b) => a.term.localeCompare(b.term, "ja"));
}

export function getGlossaryBySlug(slug: string) {
    const filePath = getGlossaryFiles().find((candidate) => {
        const entry = readEntry(candidate);
        return entry.slug === slug;
    });

    if (!filePath) return null;
    const entry = readEntry(filePath);
    if (entry.draft) return null;

    const relationships = resolveGlossaryRelationshipLinks(entry);
    return {
        ...entry,
        relatedTerms: relationships.relatedTerms,
        relatedArticles: relationships.relatedArticles,
    };
}
