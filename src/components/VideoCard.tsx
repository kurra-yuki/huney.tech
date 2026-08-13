export default function VideoCard({ title, url }: { title: string; url: string }) {
    return (
        <a href={url} target="_blank" rel="noreferrer" className="block p-3 border rounded bg-white">
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-slate-600">YouTube</div>
        </a>
    );
}
