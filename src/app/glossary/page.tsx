import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryCard } from "@/components/GlossaryCard";
import { Pagination } from "@/components/Pagination";
import { getAllGlossaryEntries } from "@/lib/glossary";

export const metadata: Metadata = {
    title: "用語辞典",
    description: "ITの基本用語を、やさしく短く、すぐに調べられる用語辞典です。",
    alternates: { canonical: "/glossary" },
};

type GlossaryPageProps = {
    searchParams: Promise<{ q?: string; group?: string; subgroup?: string; category?: string; page?: string | string[] }>;
};

type GlossaryFilters = {
    q?: string;
    group?: string;
    subgroup?: string;
    category?: string;
    page?: number;
};

function getGlossaryHref(filters: GlossaryFilters) {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.group) params.set("group", filters.group);
    if (filters.subgroup) params.set("subgroup", filters.subgroup);
    if (filters.category) params.set("category", filters.category);
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));
    const query = params.toString();
    return query ? `/glossary?${query}` : "/glossary";
}

function parsePage(value?: string | string[]) {
    const page = Number.parseInt(Array.isArray(value) ? value[0] ?? "1" : value ?? "1", 10);
    return Number.isInteger(page) && page > 0 ? page : 1;
}

const PAGE_SIZE = 12;

export default async function GlossaryPage({ searchParams }: GlossaryPageProps) {
    const { q, group, subgroup, category, page: pageParam } = await searchParams;
    const query = q?.trim().toLocaleLowerCase("ja-JP") ?? "";
    const allEntries = getAllGlossaryEntries();
    const groups = [...new Set(allEntries.map((entry) => entry.categoryGroup).filter((item): item is string => Boolean(item)))].sort((a, b) => a.localeCompare(b, "ja"));
    const groupEntries = allEntries
        .filter((entry) => entry.categoryGroup === group)
        .sort((a, b) => a.contentOrder - b.contentOrder);
    const subgroups = group
        ? [...new Set(groupEntries.map((entry) => entry.categorySubgroup).filter((item): item is string => Boolean(item)))]
        : [];
    const categoryScope = allEntries.filter((entry) => {
        if (group ? entry.categoryGroup !== group : entry.categoryGroup) return false;
        return !subgroup || entry.categorySubgroup === subgroup;
    });
    const categories = [...new Set(categoryScope.map((entry) => entry.category))]
        .filter((item) => item !== group && !subgroups.includes(item))
        .sort((a, b) => a.localeCompare(b, "ja"));
    const entries = allEntries.filter((entry) => {
        if (group && entry.categoryGroup !== group) return false;
        if (subgroup && entry.categorySubgroup !== subgroup) return false;
        if (category && entry.category !== category) return false;
        return !query || `${entry.term} ${entry.summary} ${entry.officialName ?? ""}`.toLocaleLowerCase("ja-JP").includes(query);
    });
    if (group === "応用情報（AP）" || group === "Nutanix") {
        entries.sort((a, b) => a.contentOrder - b.contentOrder);
    }
    const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
    const currentPage = Math.min(parsePage(pageParam), totalPages);
    const pageEntries = entries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="space-y-10">
            <header className="max-w-2xl">
                <p className="text-sm font-semibold text-amber-700">Huneyの用語辞典</p>
                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">用語辞典</h1>
                <p className="mt-5 leading-8 text-amber-950/65">わからない言葉を、短く、やさしく確認できます。</p>
            </header>

            <form action="/glossary" className="flex max-w-xl gap-3">
                <label htmlFor="glossary-query" className="sr-only">用語を検索</label>
                <input id="glossary-query" name="q" defaultValue={q} placeholder="用語を検索" className="min-w-0 flex-1 rounded-xl border border-amber-950/15 bg-white px-4 py-3 text-sm text-amber-950 outline-none placeholder:text-amber-950/40 focus:border-amber-700" />
                {group && <input type="hidden" name="group" value={group} />}
                {subgroup && <input type="hidden" name="subgroup" value={subgroup} />}
                {category && <input type="hidden" name="category" value={category} />}
                <button type="submit" className="rounded-xl bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">検索</button>
            </form>

            <nav aria-label="用語カテゴリ" className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-sm font-semibold text-amber-950/60">分野</span>
                    <Link href={getGlossaryHref({ q })} aria-current={!group && !category ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${!group && !category ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>すべて</Link>
                    {groups.map((item) => (
                        <Link key={item} href={getGlossaryHref({ q, group: item })} aria-current={group === item && !subgroup && !category ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${group === item && !subgroup && !category ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                            {item}
                        </Link>
                    ))}
                </div>
                {group && subgroups.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-sm font-semibold text-amber-950/60">学習テーマ</span>
                        {subgroups.map((item) => (
                            <Link key={item} href={getGlossaryHref({ q, group, subgroup: item })} aria-current={subgroup === item ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${subgroup === item ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                                {item}
                            </Link>
                        ))}
                    </div>
                )}
                {categories.length > 0 && (!group || categories.length > 1) && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-sm font-semibold text-amber-950/60">カテゴリ</span>
                        {categories.map((item) => (
                            <Link key={item} href={getGlossaryHref({ q, group, subgroup, category: item })} aria-current={category === item ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>
                                {item}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            {(group === "応用情報（AP）" || group === "Nutanix") && <p className="-mb-6 text-sm text-amber-950/55">学習順</p>}

            {entries.length > 0 ? (
                <section aria-label="用語一覧" className="grid gap-6 md:grid-cols-2">
                    {pageEntries.map((entry) => <GlossaryCard key={entry.slug} entry={entry} />)}
                </section>
            ) : (
                <section className="rounded-2xl border border-dashed border-amber-950/20 bg-white/55 px-6 py-14 text-center">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">用語を準備しています</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/60">{query ? `「${q}」に一致する用語はありません。` : "公開された用語は、ここに表示されます。"}</p>
                    {query && <Link href="/glossary" className="mt-6 inline-block text-sm font-semibold text-amber-700 hover:text-amber-950">すべての用語を見る</Link>}
                </section>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={entries.length}
                pageSize={PAGE_SIZE}
                hrefForPage={(nextPage) => getGlossaryHref({ q, group, subgroup, category, page: nextPage })}
            />
        </div>
    );
}
