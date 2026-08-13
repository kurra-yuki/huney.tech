import Link from 'next/link';

type Props = {
    title: string;
    description?: string;
    slug: string;
    category?: string;
    thumbnail?: string;
};

export default function ArticleCard({ title, description, slug, category, thumbnail }: Props) {
    return (
        <Link href={`/articles/${slug}`} className="block p-4 border rounded hover:shadow bg-white">
            <div className="flex gap-4 items-start">
                <div className="w-28 h-20 bg-slate-100 flex-shrink-0 overflow-hidden rounded">
                    {thumbnail ? <img src={thumbnail} alt={title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-cream" />}
                </div>
                <div>
                    <div className="text-xs text-slate-500">{category}</div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{description}</p>
                </div>
            </div>
        </Link>
    );
}
