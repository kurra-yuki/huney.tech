import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/types/article";

type ArticleCardProps = {
    article: ArticleSummary;
};

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-amber-950/10 bg-white/75 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            {article.thumbnail && (
                <div className="relative aspect-[16/9] bg-amber-100">
                    <Image src={article.thumbnail} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
            )}
            <div className="p-6">
                <p className="text-sm font-semibold text-amber-700">{article.category}</p>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-amber-950 group-hover:text-amber-700">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-amber-950/65">{article.description}</p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-amber-950/55">
                    <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                    <span>約{article.readingTime}分</span>
                </div>
                {article.tags && article.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="タグ">
                        {article.tags.map((tag) => <li key={tag} className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900">#{tag}</li>)}
                    </ul>
                )}
            </div>
        </article>
    );
}
