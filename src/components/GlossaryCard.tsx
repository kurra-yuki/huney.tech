import Link from "next/link";
import type { GlossaryEntry } from "@/types/glossary";

type GlossaryCardProps = {
    entry: GlossaryEntry;
};

export function GlossaryCard({ entry }: GlossaryCardProps) {
    return (
        <article className="group rounded-2xl border border-amber-950/10 bg-white/75 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
            <p className="text-sm font-semibold text-amber-700">{entry.category}</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-amber-950 group-hover:text-amber-700">
                <Link href={`/glossary/${entry.slug}`}>{entry.term}</Link>
            </h2>
            {entry.officialName && <p className="mt-2 text-xs text-amber-950/55">{entry.officialName}</p>}
            <p className="mt-4 text-sm leading-7 text-amber-950/65">{entry.summary}</p>
        </article>
    );
}
