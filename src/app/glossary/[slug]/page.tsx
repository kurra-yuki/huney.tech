import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getGlossaryBySlug } from "@/lib/glossary";

type GlossaryDetailProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: GlossaryDetailProps): Promise<Metadata> {
    const { slug } = await params;
    const entry = getGlossaryBySlug(slug);
    if (!entry) return { title: "用語が見つかりません | Huney" };

    return {
        title: `${entry.term}とは？ | IT用語辞典 | Huney`,
        description: entry.summary,
        alternates: { canonical: `/glossary/${entry.slug}` },
    };
}

export default async function GlossaryDetailPage({ params }: GlossaryDetailProps) {
    const { slug } = await params;
    const entry = getGlossaryBySlug(slug);
    if (!entry) notFound();

    const contentHtml = marked.parse(entry.content, { async: false });

    return (
        <div className="mx-auto max-w-3xl">
            <nav aria-label="パンくずリスト" className="mb-8 text-sm text-amber-950/55">
                <Link href="/" className="hover:text-amber-700">TOP</Link>
                <span className="mx-2">&gt;</span>
                <Link href="/glossary" className="hover:text-amber-700">用語辞典</Link>
                <span className="mx-2">&gt;</span>
                <span aria-current="page">{entry.term}</span>
            </nav>

            <header className="border-b border-amber-950/10 pb-8">
                <p className="text-sm font-semibold text-amber-700">{entry.category}</p>
                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">{entry.term}</h1>
                {entry.reading && <p className="mt-3 text-sm text-amber-950/55">読み方：{entry.reading}</p>}
                {entry.officialName && <p className="mt-2 text-sm text-amber-950/55">正式名称：{entry.officialName}</p>}
                <p className="mt-5 text-lg leading-8 text-amber-950/65">{entry.summary}</p>
            </header>

            <div className="article-content mt-10" dangerouslySetInnerHTML={{ __html: contentHtml }} />

            {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                <aside className="mt-12 border-t border-amber-950/10 pt-8">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">関連用語</h2>
                    <ul className="mt-4 flex flex-wrap gap-3">
                        {entry.relatedTerms.map((relatedSlug) => <li key={relatedSlug}><Link href={`/glossary/${relatedSlug}`} className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200">{relatedSlug}</Link></li>)}
                    </ul>
                </aside>
            )}

            {entry.relatedArticles && entry.relatedArticles.length > 0 && (
                <aside className="mt-10 border-t border-amber-950/10 pt-8">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">関連する記事</h2>
                    <ul className="mt-4 space-y-3">
                        {entry.relatedArticles.map((articleSlug) => <li key={articleSlug}><Link href={`/articles/${articleSlug}`} className="text-amber-700 hover:text-amber-950">記事：{articleSlug}</Link></li>)}
                    </ul>
                </aside>
            )}

            {entry.youtube && <a href={entry.youtube} target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">関連動画をYouTubeで見る</a>}
        </div>
    );
}
