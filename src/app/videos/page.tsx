export default function Videos() {
    const dummy = [
        { id: '1', title: '動画1', url: 'https://youtube.com' },
        { id: '2', title: '動画2', url: 'https://youtube.com' },
        { id: '3', title: '動画3', url: 'https://youtube.com' }
    ];
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">動画</h1>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
                {dummy.map(d => (
                    <a key={d.id} href={d.url} className="p-4 border rounded">{d.title}</a>
                ))}
            </div>
        </main>
    )
}
