import type { Metadata } from "next";
import Link from "next/link";
import { VideoCard } from "@/components/VideoCard";
import { getAllVideos, getVideosByCategory } from "@/lib/videos";

export const metadata: Metadata = {
    title: "動画一覧",
    description: "イメージと図を使って理解しやすいIT動画の入口です。",
    alternates: { canonical: "/videos" },
};

type VideosPageProps = {
    searchParams: Promise<{ category?: string }>;
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
    const { category } = await searchParams;
    const allVideos = getAllVideos();
    const categories = [...new Set(allVideos.map((video) => video.category))];
    const videos = category ? getVideosByCategory(category) : allVideos;

    return (
        <div className="space-y-10">
            <header className="max-w-2xl">
                <p className="text-sm font-semibold text-amber-700">Huneyの動画</p>
                <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">動画一覧</h1>
                <p className="mt-5 leading-8 text-amber-950/65">図や動きで理解しやすいテーマは、YouTubeの動画から学べます。</p>
            </header>

            {categories.length > 0 && (
                <nav aria-label="動画カテゴリ" className="flex flex-wrap gap-2">
                    <Link href="/videos" className={`rounded-full px-4 py-2 text-sm font-semibold ${!category ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>すべて</Link>
                    {categories.map((item) => <Link key={item} href={`/videos?category=${encodeURIComponent(item)}`} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? "bg-amber-950 text-amber-50" : "bg-white text-amber-950/70 hover:bg-amber-100"}`}>{item}</Link>)}
                </nav>
            )}

            {videos.length > 0 ? (
                <section aria-label="動画一覧" className="grid gap-6 md:grid-cols-2">
                    {videos.map((video) => <VideoCard key={video.url} video={video} />)}
                </section>
            ) : (
                <section className="rounded-2xl border border-dashed border-amber-950/20 bg-white/55 px-6 py-14 text-center">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">動画を準備しています</h2>
                    <p className="mt-3 text-sm leading-7 text-amber-950/60">{category ? `「${category}」の動画はまだ登録されていません。` : "公開された動画は、ここに表示されます。"}</p>
                    {category && <Link href="/videos" className="mt-6 inline-block text-sm font-semibold text-amber-700 hover:text-amber-950">すべての動画を見る</Link>}
                </section>
            )}
        </div>
    );
}
