import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryCard } from "@/components/GlossaryCard";
import { getAllGlossaryEntries } from "@/lib/glossary";

export const metadata: Metadata = {
    title: "用語辞典",
    description: "ITの基本用語を、やさしく短く、すぐに調べられる用語辞典です。",
    alternates: { canonical: "/glossary" },
};

type GlossaryPageProps = {
    searchParams: Promise<{ q?: string }>;
};

export default async function GlossaryPage({ searchParams }: GlossaryPageProps) {
    const { q } = await searchParams;
    const query = q?.trim().toLocaleLowerCase("ja-JP") ?? "";
    const allEntries = getAllGlossaryEntries();
    const entries = query
        ? allEntries.filter((entry) => `${entry.term} ${entry.summary} ${entry.officialName ?? ""}`.toLocaleLowerCase("ja-JP").includes(query))
        : allEntries;

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
                <button type="submit" className="rounded-xl bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">検索</button>
            </form>

            {entries.length > 0 ? (
                <section aria-label="用語一覧" className="grid gap-6 md:grid-cols-2">
                    {entries.map((entry) => <GlossaryCard key={entry.slug} entry={entry} />)}
                </section>
            ) : (
                <section className="rounded-2xl border border-dashed border-amber-950/20 bg-white/55 px-6 py-14 text-center">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">用語を準備しています</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/60">{query ? `「${q}」に一致する用語はありません。` : "公開された用語は、ここに表示されます。"}</p>
                    {query && <Link href="/glossary" className="mt-6 inline-block text-sm font-semibold text-amber-700 hover:text-amber-950">すべての用語を見る</Link>}
                </section>
            )}
        </div>
    );
}
