import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ArticleCard from '../../components/ArticleCard';

export default function ArticleList() {
    const dir = path.join(process.cwd(), 'content', 'articles');
    let posts = [] as any[];
    try {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
        posts = files.map(f => {
            const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
            const { data } = matter(raw);
            return { title: data.title, description: data.description, slug: data.slug || f.replace(/\.mdx?$/, ''), category: data.category, thumbnail: data.thumbnail };
        });
    } catch (e) { posts = []; }

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {posts.map(p => <ArticleCard key={p.slug} title={p.title} description={p.description} slug={p.slug} category={p.category} thumbnail={p.thumbnail} />)}
        </div>
    );
}
