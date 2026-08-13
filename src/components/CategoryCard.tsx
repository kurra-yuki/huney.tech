export default function CategoryCard({ name }: { name: string }) {
    return (
        <div className="p-3 bg-white border rounded text-center">
            <div className="text-sm font-medium">{name}</div>
        </div>
    );
}
