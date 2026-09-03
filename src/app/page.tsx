import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryCard } from "@/components/CategoryCard";
import { getAllArticles, getLatestArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "トップページ",
  description: "Huneyは初心者向けIT学習サイトです。ネットワークやクラウドの仕組みをやさしく学べます。",
  alternates: { canonical: "/" },
};

const categories = [
  { label: "ネットワーク", description: "つながる仕組みを、順番に理解する。" },
  { label: "クラウド", category: "クラウド / AWS", description: "雲の向こう側にあるサービスを知る。" },
  { label: "セキュリティ", description: "守るための考え方をやさしく学ぶ。" },
  { label: "Linux", description: "サーバーを支える基本から始める。" },
];

export default function Home() {
  const latestArticles = getLatestArticles(3);
  const availableCategories = new Set(getAllArticles().map((article) => article.category));
  const visibleCategories = categories.filter((category) => availableCategories.has(category.category ?? category.label));

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-3xl bg-amber-950 px-6 py-16 text-amber-50 shadow-xl shadow-amber-950/10 sm:px-10 sm:py-20 lg:px-16">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-amber-300">はちみつと学ぶIT</p>
          <h1 className="mt-5 font-serif text-5xl font-bold leading-tight tracking-tight sm:text-6xl">ITを、ひとさじ甘く。</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-amber-100/80 sm:text-lg">
            Huneyは、ITを学び始めた人のための読みものです。むずかしい言葉をそのままにせず、仕組みからゆっくり一緒に見ていきます。
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/articles" className="rounded-full bg-amber-300 px-6 py-3 text-center text-sm font-bold text-amber-950 transition-colors hover:bg-amber-200">
              記事を読む
            </Link>
            <Link href="/glossary" className="rounded-full border border-amber-100/35 px-6 py-3 text-center text-sm font-bold text-amber-50 transition-colors hover:bg-amber-50/10">
              用語から調べる
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[24px] border-amber-300/20 sm:h-96 sm:w-96" />
      </section>

      <section aria-labelledby="learning-path-heading" className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold text-amber-700">Huneyの学び方</p>
          <h2 id="learning-path-heading" className="mt-3 font-serif text-3xl font-bold tracking-tight text-amber-950">読む、調べる、見る。</h2>
          <p className="mt-4 leading-7 text-amber-950/65">その日の知りたいに合わせて、ちょうどいい入口から学べます。</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["読む", "記事", "/articles"],
            ["調べる", "用語辞典", "/glossary"],
            ["見る", "動画", "/videos"],
          ].map(([verb, label, href]) => (
            <Link key={href} href={href} className="border-l-2 border-amber-300 px-5 py-3 transition-colors hover:border-amber-700">
              <span className="text-sm text-amber-700">{verb}</span>
              <span className="mt-2 block font-serif text-xl font-bold text-amber-950">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-700">興味のあるところから</p>
            <h2 id="categories-heading" className="mt-3 font-serif text-3xl font-bold tracking-tight text-amber-950">分野で探す</h2>
          </div>
          <Link href="/articles" className="text-sm font-semibold text-amber-700 hover:text-amber-950">記事一覧へ</Link>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleCategories.map((category) => <CategoryCard key={category.label} {...category} />)}
        </div>
      </section>

      <section aria-labelledby="latest-heading" className="border-y border-amber-950/10 py-12">
        <p className="text-sm font-semibold text-amber-700">新しく公開した記事</p>
        <h2 id="latest-heading" className="mt-3 font-serif text-3xl font-bold tracking-tight text-amber-950">新着記事</h2>
        {latestArticles.length > 0 ? (
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {latestArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl bg-white/60 px-6 py-10 text-center">
            <p className="font-serif text-xl font-bold text-amber-950">記事を準備しています</p>
            <p className="mt-3 text-sm leading-6 text-amber-950/60">公開された記事は、ここに新しい順で表示されます。</p>
            <Link href="/articles" className="mt-6 inline-block text-sm font-semibold text-amber-700 hover:text-amber-950">記事一覧を見る</Link>
          </div>
        )}
      </section>

      <section className="grid gap-5 sm:grid-cols-2" aria-label="コンテンツへの導線">
        <Link href="/glossary" className="rounded-2xl bg-amber-200/70 p-7 transition-colors hover:bg-amber-200">
          <p className="text-sm font-semibold text-amber-800">IT用語辞典</p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-amber-950">わからない言葉を調べる</h2>
          <p className="mt-3 text-sm leading-6 text-amber-950/65">短く確認したいIT用語を、初心者向けに整理しています。</p>
        </Link>
        <Link href="/videos" className="rounded-2xl bg-lime-200/70 p-7 transition-colors hover:bg-lime-200">
          <p className="text-sm font-semibold text-lime-900">YouTube</p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-amber-950">動画でイメージをつかむ</h2>
          <p className="mt-3 text-sm leading-6 text-amber-950/65">図や動きで理解しやすいテーマは、動画への導線から学べます。</p>
        </Link>
      </section>

      <section aria-labelledby="about-heading" className="max-w-2xl">
        <p className="text-sm font-semibold text-amber-700">Huneyについて</p>
        <h2 id="about-heading" className="mt-3 font-serif text-3xl font-bold tracking-tight text-amber-950">学びながら、わかりやすく。</h2>
        <p className="mt-5 leading-8 text-amber-950/70">Huneyは、ITを学びながら発信する小さなサイトです。専門家だけの言葉にせず、初めて触れる人にも届く説明を目指しています。</p>
        <Link href="/profile" className="mt-6 inline-block rounded-full border border-amber-950/20 px-5 py-3 text-sm font-semibold text-amber-950 hover:bg-white">プロフィールを見る</Link>
      </section>
    </div>
  );
}
