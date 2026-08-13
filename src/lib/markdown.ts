import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function listArticles() {
    const dir = path.join(process.cwd(), 'content', 'articles');
    try {
        return fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    } catch (e) {
        return [];
    }
}

export function readArticle(slug: string) {
    const file = path.join(process.cwd(), 'content', 'articles', `${slug}.md`);
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    return { data, content };
}
