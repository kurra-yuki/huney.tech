"use client";

import Link from "next/link";
import { useState } from "react";

const navigation = [
    { href: "/articles", label: "記事" },
    { href: "/glossary", label: "用語辞典" },
    { href: "/videos", label: "動画" },
    { href: "/profile", label: "プロフィール" },
    { href: "/search", label: "検索" },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="border-b border-amber-950/10 bg-amber-50/95 backdrop-blur">
            <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="group flex items-baseline gap-2" onClick={() => setIsMenuOpen(false)}>
                    <span className="font-serif text-2xl font-bold tracking-tight text-amber-950">Huney</span>
                    <span className="hidden text-xs text-amber-900/70 sm:inline">はちみつと学ぶIT</span>
                </Link>

                <nav aria-label="メインナビゲーション" className="hidden items-center gap-1 md:flex">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-full px-4 py-2 text-sm font-medium text-amber-950/75 transition-colors hover:bg-amber-100 hover:text-amber-950"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <button
                    type="button"
                    className="rounded-lg border border-amber-950/15 px-3 py-2 text-sm font-medium text-amber-950 md:hidden"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    {isMenuOpen ? "閉じる" : "メニュー"}
                </button>
            </div>

            {isMenuOpen && (
                <nav id="mobile-navigation" aria-label="モバイルナビゲーション" className="border-t border-amber-950/10 px-4 py-3 md:hidden">
                    <div className="mx-auto grid max-w-6xl gap-1 sm:px-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-lg px-3 py-3 text-sm font-medium text-amber-950/80 hover:bg-amber-100"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
}
