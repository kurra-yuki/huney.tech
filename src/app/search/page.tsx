import Link from "next/link";
import type { Metadata } from "next";
import { searchContent } from "@/lib/search";

export const metadata: Metadata = {
    title: "検索 | Huney",
    description: "Huneyの記事と用語辞典を検索します。",
    alternates: { canonical: "/search" },
};

type SearchPageProps = {
    searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "" } = await searchParams;
    const query = q.trim();
    const results = searchContent(query);
    const resultCount = results.articles.length + results.glossary.length;
    const hasQuery = query.length > 0;

    return (
        <div className="space-y-10">
            <header className="max-w-2xl">
                <p className="text-sm font-semibold text-amber-700">Huneyを探す</p>
                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">サイト内検索</h1>
                <p className="mt-5 leading-8 text-amber-950/65">記事と用語辞典から、知りたい言葉を探せます。</p>
            </header>

            <form action="/search" className="flex max-w-2xl gap-3">
                <label htmlFor="search-query" className="sr-only">検索キーワード</label>
                <input id="search-query" name="q" defaultValue={q} placeholder="例：VLAN" className="min-w-0 flex-1 rounded-xl border border-amber-950/15 bg-white px-4 py-3 text-sm text-amber-950 outline-none placeholder:text-amber-950/40 focus:border-amber-700" />
                <button type="submit" className="rounded-xl bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">検索</button>
            </form>

            {hasQuery && <p className="text-sm text-amber-950/65">「{query}」の検索結果：{resultCount}件</p>}

            {!hasQuery ? (
                <section className="rounded-2xl border border-dashed border-amber-950/20 bg-white/55 px-6 py-14 text-center">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">キーワードを入力してください</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/60">記事タイトルや用語名から検索できます。</p>
                </section>
            ) : resultCount === 0 ? (
                <section className="rounded-2xl border border-dashed border-amber-950/20 bg-white/55 px-6 py-14 text-center">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">一致するコンテンツがありません</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/60">「{query}」に一致するコンテンツはありませんでした。</p>
                </section>
            ) : (
                <div className="space-y-10">
                    {results.articles.length > 0 && (
                        <section aria-labelledby="article-results-heading">
                            <h2 id="article-results-heading" className="font-serif text-2xl font-bold text-amber-950">記事 <span className="text-base font-normal text-amber-950/50">{results.articles.length}件</span></h2>
                            <ul className="mt-4 divide-y divide-amber-950/10 rounded-2xl bg-white/60 px-6">
                                {results.articles.map((article) => <li key={article.slug} className="py-5"><Link href={`/articles/${article.slug}`} className="font-serif text-xl font-bold text-amber-950 hover:text-amber-700">{article.title}</Link><p className="mt-2 text-sm leading-6 text-amber-950/60">{article.description}</p></li>)}
                            </ul>
                        </section>
                    )}
                    {results.glossary.length > 0 && (
                        <section aria-labelledby="glossary-results-heading">
                            <h2 id="glossary-results-heading" className="font-serif text-2xl font-bold text-amber-950">用語辞典 <span className="text-base font-normal text-amber-950/50">{results.glossary.length}件</span></h2>
                            <ul className="mt-4 divide-y divide-amber-950/10 rounded-2xl bg-white/60 px-6">
                                {results.glossary.map((entry) => <li key={entry.slug} className="py-5"><Link href={`/glossary/${entry.slug}`} className="font-serif text-xl font-bold text-amber-950 hover:text-amber-700">{entry.term}</Link><p className="mt-2 text-sm leading-6 text-amber-950/60">{entry.summary}</p></li>)}
                            </ul>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
