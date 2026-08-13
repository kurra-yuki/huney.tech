"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<any[]>([]);
    const [editing, setEditing] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(r => {
            setUser(r.data.session?.user ?? null);
            setLoading(false);
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => { sub?.subscription?.unsubscribe?.(); };
    }, []);

    async function signIn() {
        await supabase.auth.signInWithOAuth({ provider: 'github' });
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    async function createArticle(e: any) {
        e.preventDefault();
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return alert('You must sign in');
        const res = await fetch('/api/admin/create-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, slug, content })
        });
        const j = await res.json();
        if (!res.ok) return alert(j.message || 'Error');
        alert('Article created');
        setTitle(''); setSlug(''); setContent('');
    }

    async function fetchList() {
        const res = await fetch('/api/admin/list-articles');
        const j = await res.json();
        setFiles(j.files || []);
    }

    async function editArticle(file: any) {
        const name = file.name.replace(/\.mdx?$|\.md$/, '');
        const res = await fetch(`/api/admin/get-article?slug=${encodeURIComponent(name)}`);
        const j = await res.json();
        setEditing({ slug: name, content: j.content, sha: j.sha });
        setTitle(''); setSlug(''); setContent('');
    }

    async function saveEdit(e: any) {
        e.preventDefault();
        if (!editing) return;
        const res = await fetch('/api/admin/update-article', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: editing.slug, content: editing.content, sha: editing.sha }) });
        const j = await res.json();
        if (!res.ok) return alert(j.message || 'Error');
        alert('Updated');
        setEditing(null);
        fetchList();
    }

    useEffect(() => { fetchList(); }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    if (!user) return (
        <div className="container mx-auto p-6">
            <h1 className="text-xl font-bold">管理画面</h1>
            <p className="mt-4">Supabaseでログインしてください。</p>
            <button onClick={signIn} className="mt-4 px-4 py-2 bg-honey text-white rounded">Sign in with GitHub</button>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-xl font-bold">管理画面</h1>
            <div className="mt-4">Signed in: {user.email} <button onClick={signOut} className="ml-4 text-sm text-blue-600">Sign out</button></div>

            <form onSubmit={createArticle} className="mt-6 space-y-3">
                <div>
                    <label className="block text-sm">Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm">Slug</label>
                    <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full border px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm">Content (markdown)</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border px-3 py-2 h-40" />
                </div>
                <div>
                    <button className="px-4 py-2 bg-honey text-white rounded">Create Article</button>
                </div>
            </form>

            <section className="mt-8">
                <h2 className="font-semibold">既存記事</h2>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {files.map(f => (
                        <div key={f.sha} className="p-3 border rounded flex justify-between items-center">
                            <div>{f.name}</div>
                            <div>
                                <button onClick={() => editArticle(f)} className="px-3 py-1 text-sm border rounded">編集</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {editing && (
                <section className="mt-8">
                    <h2 className="font-semibold">編集: {editing.slug}</h2>
                    <form onSubmit={saveEdit} className="mt-3 space-y-3">
                        <div>
                            <label className="block text-sm">Markdown</label>
                            <textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} className="w-full border px-3 py-2 h-60" />
                        </div>
                        <div>
                            <button className="px-4 py-2 bg-honey text-white rounded">保存</button>
                            <button type="button" onClick={() => setEditing(null)} className="ml-2 px-4 py-2 border rounded">キャンセル</button>
                        </div>
                    </form>
                </section>
            )}
        </div>
    );
}
