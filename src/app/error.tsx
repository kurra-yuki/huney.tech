"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-amber-700">ERROR</p>
            <h1 className="mt-4 font-serif text-4xl font-bold text-amber-950">ページを表示できません</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-amber-950/65">時間をおいてもう一度お試しください。問題が続く場合は、トップページから移動してください。</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={reset} className="rounded-full bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-800">もう一度試す</button>
                <Link href="/" className="rounded-full border border-amber-950/20 px-5 py-3 text-sm font-semibold text-amber-950 hover:bg-white">トップへ戻る</Link>
            </div>
        </section>
    );
}
