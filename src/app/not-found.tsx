import Link from "next/link";

export default function NotFound() {
    return (
        <section className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-700">404</p>
            <h1 className="mt-4 font-serif text-4xl font-bold text-amber-950">ページが見つかりません</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-amber-950/65">お探しのページは移動したか、まだ公開されていない可能性があります。</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/" className="rounded-full bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">トップへ戻る</Link>
                <Link href="/articles" className="rounded-full border border-amber-950/20 px-5 py-3 text-sm font-semibold text-amber-950 hover:bg-white">記事一覧を見る</Link>
            </div>
        </section>
    );
}
