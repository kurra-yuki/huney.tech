import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import { getArticleBySlug } from "@/lib/articles";

type ArticlePageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        return { title: "記事が見つかりません | Huney" };
    }

    return {
        title: `${article.seoTitle ?? article.title} | Huney`,
        description: article.description,
        alternates: { canonical: `/articles/${article.slug}` },
        openGraph: {
            title: article.seoTitle ?? article.title,
            description: article.description,
            type: "article",
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt ?? article.publishedAt,
            images: article.ogImage ?? article.thumbnail ? [article.ogImage ?? article.thumbnail!] : undefined,
        },
    };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const articleHtml = marked.parse(article.content, { async: false });
    const relatedArticles = article.relatedArticles ?? [];

    return (
        <div className="mx-auto max-w-3xl">
            <nav aria-label="パンくずリスト" className="mb-8 text-sm text-amber-950/55">
                <Link href="/" className="hover:text-amber-700">TOP</Link>
                <span className="mx-2">&gt;</span>
                <Link href="/articles" className="hover:text-amber-700">記事</Link>
                <span className="mx-2">&gt;</span>
                <span aria-current="page">{article.title}</span>
            </nav>

            <header>
                <p className="text-sm font-semibold text-amber-700">{article.category}</p>
                <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-amber-950 sm:text-5xl">{article.title}</h1>
                <p className="mt-5 text-lg leading-8 text-amber-950/65">{article.description}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-amber-950/55">
                    <time dateTime={article.publishedAt}>公開日：{article.publishedAt}</time>
                    {article.updatedAt && <time dateTime={article.updatedAt}>更新日：{article.updatedAt}</time>}
                    <span>読了時間：約{article.readingTime}分</span>
                </div>
                {article.tags && article.tags.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="タグ">
                        {article.tags.map((tag) => <li key={tag} className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900">#{tag}</li>)}
                    </ul>
                )}
                {article.thumbnail && (
                    <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-amber-100">
                        <Image src={article.thumbnail} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
                    </div>
                )}
            </header>

            <div className="article-content mt-12" dangerouslySetInnerHTML={{ __html: articleHtml }} />

            {article.youtube && (
                <aside className="mt-12 rounded-2xl bg-amber-200/70 p-6">
                    <p className="text-sm font-semibold text-amber-800">関連動画</p>
                    <p className="mt-2 font-serif text-xl font-bold text-amber-950">動画でも学ぶ</p>
                    <a href={article.youtube} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">
                        YouTubeで見る
                    </a>
                </aside>
            )}

            {relatedArticles.length > 0 && (
                <aside className="mt-12 border-t border-amber-950/10 pt-8">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">関連記事</h2>
                    <ul className="mt-4 space-y-3">
                        {relatedArticles.map((relatedSlug) => (
                            <li key={relatedSlug}>
                                <Link href={`/articles/${relatedSlug}`} className="text-amber-700 hover:text-amber-950">{relatedSlug}</Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </div>
    );
}
