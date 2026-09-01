import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/config/profile";

export const metadata: Metadata = {
    title: "プロフィール | Huney",
    description: "Huneyの発信方針と、はちみつと学ぶITに込めた考えを紹介します。",
    alternates: { canonical: "/profile" },
};

export default function ProfilePage() {
    return (
        <div className="space-y-16">
            <header className="max-w-3xl">
                <p className="text-sm font-semibold text-amber-700">Huneyについて</p>
                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">プロフィール</h1>
                <p className="mt-5 text-lg leading-8 text-amber-950/65">{profile.introduction}</p>
            </header>

            <section aria-labelledby="about-author-heading" className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
                <div className="flex aspect-square max-w-xs items-center justify-center rounded-3xl bg-amber-200/70 p-8">
                    <div className="text-center">
                        <p className="font-serif text-5xl font-bold text-amber-950">Huney</p>
                        <p className="mt-3 text-sm text-amber-900/70">はちみつと学ぶIT</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-amber-700">活動名</p>
                    <h2 id="about-author-heading" className="mt-3 font-serif text-3xl font-bold text-amber-950">{profile.activityName}</h2>
                    <p className="mt-5 leading-8 text-amber-950/70">{profile.learningPolicy}</p>
                </div>
            </section>

            <section aria-labelledby="about-huney-heading" className="border-y border-amber-950/10 py-12">
                <p className="text-sm font-semibold text-amber-700">About Huney</p>
                <h2 id="about-huney-heading" className="mt-3 font-serif text-3xl font-bold text-amber-950">ITを、ひとさじ甘く。</h2>
                <p className="mt-5 max-w-3xl leading-8 text-amber-950/70">
                    Huneyは、ネットワーク、クラウド、サーバー、セキュリティなどのIT技術を、初心者にも理解しやすい言葉で整理する学習サイトです。記事は「読む」、用語辞典は「調べる」、動画は「見る」ための入口として役割を分けています。
                </p>
            </section>

            <section aria-labelledby="policy-heading" className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/70 p-6">
                    <p className="text-2xl" aria-hidden="true">01</p>
                    <h2 className="mt-4 font-serif text-xl font-bold text-amber-950">やさしい言葉で</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/65">専門用語を専門用語だけで説明せず、身近な例と順番を大切にします。</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-6">
                    <p className="text-2xl" aria-hidden="true">02</p>
                    <h2 id="policy-heading" className="mt-4 font-serif text-xl font-bold text-amber-950">知識を少しずつ</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/65">すべてを一度に覚えるのではなく、まず一つ分かったと思える説明を目指します。</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-6">
                    <p className="text-2xl" aria-hidden="true">03</p>
                    <h2 className="mt-4 font-serif text-xl font-bold text-amber-950">正確さを大切に</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/65">初心者向けでも内容の正確さを犠牲にせず、必要に応じて更新します。</p>
                </div>
            </section>

            <section aria-labelledby="qualifications-heading" className="max-w-2xl">
                <p className="text-sm font-semibold text-amber-700">Qualifications</p>
                <h2 id="qualifications-heading" className="mt-3 font-serif text-3xl font-bold text-amber-950">保有資格</h2>
                {profile.qualifications.length > 0 ? (
                    <ul className="mt-5 list-disc space-y-2 pl-5 text-amber-950/70">
                        {profile.qualifications.map((qualification) => <li key={qualification}>{qualification}</li>)}
                    </ul>
                ) : (
                    <p className="mt-5 leading-7 text-amber-950/60">現在掲載している資格情報はありません。</p>
                )}
            </section>

            {profile.externalLinks.length > 0 && (
                <section aria-labelledby="external-links-heading" className="max-w-2xl">
                    <h2 id="external-links-heading" className="font-serif text-3xl font-bold text-amber-950">外部リンク</h2>
                    <ul className="mt-5 flex flex-wrap gap-3">
                        {profile.externalLinks.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer" className="rounded-full bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">{link.label} ↗</a></li>)}
                    </ul>
                </section>
            )}

            <div>
                <Link href="/articles" className="rounded-full border border-amber-950/20 px-5 py-3 text-sm font-semibold text-amber-950 hover:bg-white">記事を読む</Link>
            </div>
        </div>
    );
}
