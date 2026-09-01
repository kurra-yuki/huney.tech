import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");
const glossaryDirectory = path.join(process.cwd(), "content/glossary");
const supportedExtensions = new Set([".md", ".mdx"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const articleSlugs = new Map();
const glossarySlugs = new Map();
const errors = [];

function isIndexFile(filePath) {
    const fileName = path.basename(filePath).toLowerCase();
    return fileName === "00_index.md" || fileName === "index.md";
}

function getFilesRecursively(dir) {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return getFilesRecursively(fullPath);
        }

        if (entry.isFile() && supportedExtensions.has(path.extname(entry.name)) && !isIndexFile(fullPath)) {
            return [fullPath];
        }

        return [];
    });
}

if (fs.existsSync(articlesDirectory)) {
    const files = getFilesRecursively(articlesDirectory);

    for (const filePath of files) {
        const fileName = path.basename(filePath);
        const source = fs.readFileSync(filePath, "utf8");
        const { data } = matter(source);

        if (typeof data.title !== "string" || !data.title.trim()) errors.push(`${fileName}: title`);
        if (typeof data.slug !== "string" || !slugPattern.test(data.slug)) errors.push(`${fileName}: slug`);
        if (typeof data.description !== "string" || !data.description.trim()) errors.push(`${fileName}: description`);
        if (typeof data.publishedAt !== "string" || Number.isNaN(Date.parse(data.publishedAt))) errors.push(`${fileName}: publishedAt`);
        if (typeof data.category !== "string" || !data.category.trim()) errors.push(`${fileName}: category`);
        if (typeof data.draft !== "boolean") errors.push(`${fileName}: draft`);
        if (data.updatedAt !== undefined && (typeof data.updatedAt !== "string" || Number.isNaN(Date.parse(data.updatedAt)))) errors.push(`${fileName}: updatedAt`);
        if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string"))) errors.push(`${fileName}: tags`);
        if (data.relatedArticles !== undefined && (!Array.isArray(data.relatedArticles) || data.relatedArticles.some((slug) => typeof slug !== "string"))) errors.push(`${fileName}: relatedArticles`);

        if (typeof data.slug === "string") {
            const previousFile = articleSlugs.get(data.slug);
            if (previousFile) errors.push(`${fileName}: slug '${data.slug}' is duplicated with ${previousFile}`);
            articleSlugs.set(data.slug, fileName);
        }
    }
}

if (fs.existsSync(glossaryDirectory)) {
    const files = getFilesRecursively(glossaryDirectory);

    for (const filePath of files) {
        const fileName = path.basename(filePath);
        const source = fs.readFileSync(filePath, "utf8");
        const { data } = matter(source);

        if (typeof data.term !== "string" || !data.term.trim()) errors.push(`${fileName}: term`);
        if (typeof data.slug !== "string" || !slugPattern.test(data.slug)) errors.push(`${fileName}: slug`);
        if (typeof data.summary !== "string" || !data.summary.trim()) errors.push(`${fileName}: summary`);
        if (typeof data.category !== "string" || !data.category.trim()) errors.push(`${fileName}: category`);
        if (typeof data.draft !== "boolean") errors.push(`${fileName}: draft`);
        if (data.relatedTerms !== undefined && (!Array.isArray(data.relatedTerms) || data.relatedTerms.some((slug) => typeof slug !== "string"))) errors.push(`${fileName}: relatedTerms`);
        if (data.relatedArticles !== undefined && (!Array.isArray(data.relatedArticles) || data.relatedArticles.some((slug) => typeof slug !== "string"))) errors.push(`${fileName}: relatedArticles`);

        if (typeof data.slug === "string") {
            const previousFile = glossarySlugs.get(data.slug);
            if (previousFile) errors.push(`${fileName}: slug '${data.slug}' is duplicated with ${previousFile}`);
            glossarySlugs.set(data.slug, fileName);
        }
    }
}

if (errors.length > 0) {
    console.error("Content validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
} else {
    console.log(`Content validation passed (${articleSlugs.size} articles, ${glossarySlugs.size} glossary entries).`);
}
