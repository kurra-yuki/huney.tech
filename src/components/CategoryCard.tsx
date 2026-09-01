import Link from "next/link";

type CategoryCardProps = {
    label: string;
    description: string;
};

export function CategoryCard({ label, description }: CategoryCardProps) {
    return (
        <Link
            href={`/articles?category=${encodeURIComponent(label)}`}
            className="group rounded-2xl border border-amber-950/10 bg-white/70 p-5 shadow-sm transition-transform hover:-translate-y-1 hover:border-amber-700/30 hover:bg-white"
        >
            <span className="text-sm font-semibold text-amber-700">分野</span>
            <h3 className="mt-2 font-serif text-xl font-bold text-amber-950 group-hover:text-amber-700">{label}</h3>
            <p className="mt-2 text-sm leading-6 text-amber-950/65">{description}</p>
        </Link>
    );
}
