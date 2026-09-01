import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getAllArticles, getArticlesByCategory } from "@/lib/articles";

export const metadata: Metadata = {
    title: "記事一覧",
    description: "ITの基礎や仕組みを、初心者向けの読みやすい記事で学べます。",
    alternates: { canonical: "/articles" },
};

type ArticlesPageProps = {
    searchParams: Promise<{ category?: string }>;
};

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    const { category } = await searchParams;
    const articles = category ? getArticlesByCategory(category) : getAllArticles();
    const categories = [...new Set(getAllArticles().map((article) => article.category))];

    return (
        <div className="space-y-10">
            <header className="max-w-2xl">
                <p className="text-sm font-semibold text-amber-700">Huneyの記事</p>
                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">記事一覧</h1>
                <p className="mt-5 leading-8 text-amber-950/65">ITの仕組みを、初心者にも読みやすい言葉で整理しています。</p>
            </header>

            {categories.length > 0 && (
                <nav aria-label="記事カテゴリ" className="flex flex-wrap gap-2">
                    <Link href="/articles" className={`rounded-full px-4 py-2 text-sm font-semibold ${!category ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                        すべて
                    </Link>
                    {categories.map((item) => (
                        <Link key={item} href={`/articles?category=${encodeURIComponent(item)}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                            {item}
                        </Link>
                    ))}
                </nav>
            )}

            {articles.length > 0 ? (
                <section aria-label="記事一覧" className="grid gap-6 md:grid-cols-2">
                    {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
                </section>
            ) : (
                <section className="rounded-2xl border border-dashed border-amber-950/20 bg-white/55 px-6 py-14 text-center">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">記事を準備しています</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/60">
                        {category ? `「${category}」の記事はまだ公開されていません。` : "公開された記事は、ここに新しい順で表示されます。"}
                    </p>
                    {category && <Link href="/articles" className="mt-6 inline-block text-sm font-semibold text-amber-700 hover:text-amber-950">すべての記事を見る</Link>}
                </section>
            )}
        </div>
    );
}
