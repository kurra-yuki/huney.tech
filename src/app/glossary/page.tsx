export default function GlossaryPage() {
    const terms = ['DNS', 'NAT', 'VLAN', 'VPN', 'TCP', 'IP', 'HTTP', 'HTTPS'];
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">用語辞典</h1>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                {terms.map(t => (
                    <div key={t} className="p-3 border rounded bg-white">{t}</div>
                ))}
            </div>
        </main>
    )
}
