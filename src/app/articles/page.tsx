import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
    title: "記事一覧",
    description: "ITの基礎や仕組みを、初心者向けの読みやすい記事で学べます。",
    alternates: { canonical: "/articles" },
};

type ArticlesPageProps = {
    searchParams: Promise<{ category?: string; group?: string; subgroup?: string }>;
};

type ArticleFilters = {
    category?: string;
    group?: string;
    subgroup?: string;
};

function getArticleHref(filters: ArticleFilters) {
    const params = new URLSearchParams();
    if (filters.group) params.set("group", filters.group);
    if (filters.subgroup) params.set("subgroup", filters.subgroup);
    if (filters.category) params.set("category", filters.category);
    const query = params.toString();
    return query ? `/articles?${query}` : "/articles";
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
    const { category, group, subgroup } = await searchParams;
    const allArticles = getAllArticles();
    const groups = [...new Set(allArticles.map((article) => article.categoryGroup).filter((item): item is string => Boolean(item)))].sort((a, b) => a.localeCompare(b, "ja"));
    const groupArticles = allArticles
        .filter((article) => article.categoryGroup === group)
        .sort((a, b) => a.contentOrder - b.contentOrder);
    const subgroups = group
        ? [...new Set(groupArticles.map((article) => article.categorySubgroup).filter((item): item is string => Boolean(item)))]
        : [];
    const categoryScope = allArticles.filter((article) => {
        if (group ? article.categoryGroup !== group : article.categoryGroup) return false;
        return !subgroup || article.categorySubgroup === subgroup;
    });
    const categories = [...new Set(categoryScope.map((article) => article.category))]
        .filter((item) => item !== group && !subgroups.includes(item))
        .sort((a, b) => a.localeCompare(b, "ja"));
    const articles = allArticles.filter((article) => {
        if (group && article.categoryGroup !== group) return false;
        if (subgroup && article.categorySubgroup !== subgroup) return false;
        return !category || article.category === category;
    });
    const usesLearningOrder = group === "応用情報（AP）" || group === "Nutanix";
    if (usesLearningOrder) articles.sort((a, b) => a.contentOrder - b.contentOrder);

    return (
        <div className="space-y-10">
            <header className="max-w-2xl">
                <p className="text-sm font-semibold text-amber-700">Huneyの記事</p>
                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">記事一覧</h1>
                <p className="mt-5 leading-8 text-amber-950/65">ITの仕組みを、初心者にも読みやすい言葉で整理しています。</p>
            </header>

            <nav aria-label="記事カテゴリ" className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-sm font-semibold text-amber-950/60">分野</span>
                    <Link href={getArticleHref({})} aria-current={!group && !category ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${!group && !category ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>すべて</Link>
                    {groups.map((item) => (
                        <Link key={item} href={getArticleHref({ group: item })} aria-current={group === item && !subgroup && !category ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${group === item && !subgroup && !category ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                            {item}
                        </Link>
                    ))}
                </div>
                {group && subgroups.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-sm font-semibold text-amber-950/60">学習テーマ</span>
                        {subgroups.map((item) => (
                            <Link key={item} href={getArticleHref({ group, subgroup: item })} aria-current={subgroup === item ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${subgroup === item ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                                {item}
                            </Link>
                        ))}
                    </div>
                )}
                {categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-sm font-semibold text-amber-950/60">カテゴリ</span>
                        {categories.map((item) => (
                            <Link key={item} href={getArticleHref({ group, subgroup, category: item })} aria-current={category === item ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                                {item}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            {usesLearningOrder && <p className="-mb-6 text-sm text-amber-950/55">学習順</p>}

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
                    {(category || group || subgroup) && <Link href={getArticleHref({})} className="mt-6 inline-block text-sm font-semibold text-amber-700 hover:text-amber-950">すべての記事を見る</Link>}
                </section>
            )}
        </div>
    );
}
