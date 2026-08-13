import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import React from 'react';

function extractYouTubeId(url?: string) {
    if (!url) return null;
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
        if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    } catch (e) {
        // fallback: regex
        const m = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
        return m ? m[1] : null;
    }
    return null;
}

type Props = { params: { slug: string } };

export default function ArticlePage({ params }: Props) {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`);
    if (!fs.existsSync(filePath)) return notFound();
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const html = marked.parse(content || '');

    return (
        <main className="container mx-auto px-4 py-8">
            <nav className="text-sm text-slate-500">記事 / {data.title}</nav>
            <h1 className="text-3xl font-bold mt-4">{data.title}</h1>
            <p className="text-slate-600 mt-2">{data.description}</p>
            <article className="prose prose-lg max-w-none mt-6">
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </article>
            {data.youtube && (
                <div className="mt-6">
                    <h4 className="font-semibold">動画</h4>
                    <div className="mt-2 w-full aspect-video">
                        {(() => {
                            const id = extractYouTubeId(data.youtube as string);
                            if (!id) return <a href={data.youtube as string} className="text-blue-600">YouTubeリンク</a>;
                            const src = `https://www.youtube.com/embed/${id}`;
                            return (
                                <iframe src={src} title="YouTube video" className="w-full h-full" frameBorder="0" allowFullScreen />
                            );
                        })()}
                    </div>
                </div>
            )}
        </main>
    );
}
