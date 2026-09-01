import Image from "next/image";
import type { Video } from "@/types/video";

type VideoCardProps = {
    video: Video;
};

export function VideoCard({ video }: VideoCardProps) {
    return (
        <article className="overflow-hidden rounded-2xl border border-amber-950/10 bg-white/75 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            {video.thumbnail && (
                <div className="relative aspect-video bg-amber-100">
                    <Image src={video.thumbnail} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
            )}
            <div className="p-6">
                <p className="text-sm font-semibold text-amber-700">{video.category}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-amber-950">{video.title}</h2>
                {video.description && <p className="mt-3 text-sm leading-7 text-amber-950/65">{video.description}</p>}
                {video.publishedAt && <time dateTime={video.publishedAt} className="mt-4 block text-xs text-amber-950/55">公開日：{video.publishedAt}</time>}
                <a href={video.url} target="_blank" rel="noreferrer" className="mt-5 inline-block rounded-full bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">
                    YouTubeで見る ↗
                </a>
            </div>
        </article>
    );
}
