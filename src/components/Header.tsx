import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-cream flex items-center justify-center">
                            <img src="/images/icon.jpeg" alt="logo" className="w-10 h-10 object-cover" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-brown">Huney.tech</div>
                            <div className="text-xs text-slate-500">ITを、ひとさじ甘く。</div>
                        </div>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
                    <Link href="/articles">記事</Link>
                    <Link href="/glossary">用語辞典</Link>
                    <Link href="/videos">動画</Link>
                    <Link href="/profile">プロフィール</Link>
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <input aria-label="サイト内検索" placeholder="キーワードで検索" className="px-3 py-2 border rounded-l-md" />
                    <button className="px-3 py-2 bg-honey text-white rounded-r-md">検索</button>
                </div>
            </div>
        </header>
    );
}
