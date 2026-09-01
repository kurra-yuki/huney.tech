import Link from "next/link";

const navigation = [
    { href: "/articles", label: "記事" },
    { href: "/glossary", label: "用語辞典" },
    { href: "/videos", label: "動画" },
    { href: "/profile", label: "プロフィール" },
];

export function Footer() {
    return (
        <footer className="border-t border-amber-950/10 bg-amber-950 text-amber-50">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
                <div>
                    <p className="font-serif text-2xl font-bold">Huney</p>
                    <p className="mt-2 text-sm text-amber-100/75">ITを、ひとさじ甘く。</p>
                </div>
                <nav aria-label="フッターナビゲーション" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-amber-100/80">
                    {navigation.map((item) => (
                        <Link key={item.href} href={item.href} className="hover:text-white">
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t border-amber-100/15 px-4 py-4 text-center text-xs text-amber-100/60">
                © {new Date().getFullYear()} Huney
            </div>
        </footer>
    );
}
