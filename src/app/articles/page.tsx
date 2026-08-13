import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { listArticles } from '../../lib/markdown';

type Post = { title: string; description?: string; slug: string };

export default function ArticlesPage() {
    const dir = path.join(process.cwd(), 'content', 'articles');
    let posts: Post[] = [];
    try {
        const files = listArticles();
        posts = files.map((f) => {
            const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
            const { data } = matter(raw);
            const slug = (data.slug as string) || f.replace(/\.mdx?$/, '');
            return { title: data.title as string, description: data.description as string | undefined, slug };
        });
    } catch (e) {
        posts = [];
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">記事一覧</h1>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
                {posts.map(p => (
                    <Link key={p.slug} href={`/articles/${p.slug}`} className="p-4 border rounded hover:shadow">
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="text-sm text-slate-600">{p.description}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
