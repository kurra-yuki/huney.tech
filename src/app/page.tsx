import Link from 'next/link';

export default function Home() {
    return (
        <main className="container mx-auto px-4 py-8">
            <header className="flex items-center justify-between py-4">
                <h1 className="text-2xl font-bold text-brown">Huney.tech</h1>
                <nav className="space-x-4 hidden md:block">
                    <Link href="/articles">記事</Link>
                    <Link href="/glossary">用語辞典</Link>
                    <Link href="/videos">動画</Link>
                    <Link href="/profile">プロフィール</Link>
                </nav>
            </header>

            <section className="relative bg-cream rounded-lg p-6 md:p-12 overflow-hidden">
                <div className="container mx-auto grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-brown">ITを、ひとさじ甘く。</h2>
                        <p className="mt-4 text-lg text-slate-700 max-w-xl">
                            IT初心者向けにネットワーク、クラウド、Linux、セキュリティなどを、図解や例え話を使ってやさしく解説するサイトです。
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/articles" className="px-4 py-2 bg-honey text-white rounded-full shadow">記事を読む</Link>
                            <Link href="/glossary" className="px-4 py-2 border border-slate-200 rounded-full">用語から調べる</Link>
                        </div>
                    </div>

                    <div className="relative flex justify-center md:justify-end">
                        <img src="/images/char.jpeg" alt="mascot hero" className="w-64 md:w-96 object-contain" />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-2xl font-bold py-4">カテゴリ</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['ネットワーク', 'クラウド', 'Linux', 'サーバー', 'セキュリティ', '仮想化', 'データベース', 'AI', 'プログラミング', 'その他'].map((c) => (
                        <div key={c} className="p-4 border rounded shadow-sm">{c}</div>
                    ))}
                </div>
            </section>

            <section className="py-8">
                <h3 className="text-2xl font-bold">新着記事</h3>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <article className="p-4 border rounded">VLANとは？</article>
                </div>
            </section>
        </main>
    );
}
