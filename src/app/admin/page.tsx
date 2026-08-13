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
    const [tab, setTab] = useState<'articles' | 'glossary' | 'profile' | 'videos'>('articles');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [glossaryTerm, setGlossaryTerm] = useState('');
    const [glossarySlug, setGlossarySlug] = useState('');
    const [glossaryDescription, setGlossaryDescription] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoSlug, setVideoSlug] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [profileName, setProfileName] = useState('');
    const [profileBio, setProfileBio] = useState('');

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
        const redirectTo = typeof window !== 'undefined' ? window.location.origin + '/admin' : undefined;
        await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } });
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    async function createArticle(e: any) {
        e.preventDefault();
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return alert('You must sign in');
        let uploadedUrl = thumbnailUrl;
        if (thumbnailFile) {
            // upload via server API to use service role
            const filename = `${Date.now()}_${thumbnailFile.name}`;
            const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    const comma = result.indexOf(',');
                    resolve(result.slice(comma + 1));
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
            const b64 = await toBase64(thumbnailFile);
            const res = await fetch('/api/admin/upload-image', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ filename, content: b64, contentType: thumbnailFile.type }) });
            const j = await res.json();
            if (!res.ok) return alert(j.message || 'Upload failed');
            uploadedUrl = j.publicUrl;
            setThumbnailUrl(uploadedUrl);
        }

        const res = await fetch('/api/admin/create-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title, slug, content, thumbnail: uploadedUrl })
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

    async function createGlossary(e: any) {
        e.preventDefault();
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return alert('Sign in');
        const res = await fetch('/api/admin/create-glossary', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ term: glossaryTerm, slug: glossarySlug, description: glossaryDescription }) });
        const j = await res.json();
        if (!res.ok) return alert(j.message || 'Error');
        alert('Glossary added');
        setGlossaryTerm(''); setGlossarySlug(''); setGlossaryDescription('');
    }

    async function createVideo(e: any) {
        e.preventDefault();
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return alert('Sign in');
        const res = await fetch('/api/admin/create-video', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title: videoTitle, slug: videoSlug, url: videoUrl }) });
        const j = await res.json();
        if (!res.ok) return alert(j.message || 'Error');
        alert('Video added');
        setVideoTitle(''); setVideoSlug(''); setVideoUrl('');
    }

    async function saveProfile(e: any) {
        e.preventDefault();
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return alert('Sign in');
        const res = await fetch('/api/admin/update-profile', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: profileName, bio: profileBio, avatar: thumbnailUrl }) });
        const j = await res.json();
        if (!res.ok) return alert(j.message || 'Error');
        alert('Profile updated');
    }

    async function editArticle(file: any) {
        const name = file.name.replace(/\.mdx?$|\.md$/, '');
        const res = await fetch(`/api/admin/get-article?slug=${encodeURIComponent(name)}`);
        const j = await res.json();
        setEditing({ slug: name, content: j.content, sha: j.sha });
        setTitle(''); setSlug(''); setContent('');
    }

    async function deleteArticle(file: any) {
        const ok = confirm('この記事を削除してもよいですか？ 削除は取り消せません。');
        if (!ok) return;
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return alert('You must sign in');
        const name = file.name.replace(/\.mdx?$|\.md$/, '');
        const res = await fetch('/api/admin/delete-article', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ slug: name, sha: file.sha }) });
        const j = await res.json();
        if (!res.ok) return alert(j.message || 'Delete failed');
        alert('Deleted');
        fetchList();
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

            <div className="mt-6">
                <div className="flex gap-2">
                    <button onClick={() => setTab('articles')} className={`${tab === 'articles' ? 'bg-honey text-white' : 'border'} px-3 py-1 rounded`}>記事</button>
                    <button onClick={() => setTab('glossary')} className={`${tab === 'glossary' ? 'bg-honey text-white' : 'border'} px-3 py-1 rounded`}>用語</button>
                    <button onClick={() => setTab('videos')} className={`${tab === 'videos' ? 'bg-honey text-white' : 'border'} px-3 py-1 rounded`}>動画</button>
                    <button onClick={() => setTab('profile')} className={`${tab === 'profile' ? 'bg-honey text-white' : 'border'} px-3 py-1 rounded`}>プロフィール</button>
                </div>
                <div className="mt-4">
                    {tab === 'articles' && (
                        <form onSubmit={createArticle} className="space-y-3">
                            <div>
                                <label className="block text-sm">Title</label>
                                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm">Slug</label>
                                <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm">Thumbnail (image)</label>
                                <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] ?? null)} />
                                {thumbnailUrl && <div className="mt-2"><img src={thumbnailUrl} alt="thumb" className="w-40 h-24 object-cover" /></div>}
                            </div>
                            <div>
                                <label className="block text-sm">Content (markdown)</label>
                                <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border px-3 py-2 h-40" />
                            </div>
                            <div>
                                <button className="px-4 py-2 bg-honey text-white rounded">Create Article</button>
                            </div>
                        </form>
                    )}

                    {tab === 'glossary' && (
                        <form onSubmit={createGlossary} className="space-y-3">
                            <div>
                                <label className="block text-sm">用語 (term)</label>
                                <input value={glossaryTerm} onChange={e => setGlossaryTerm(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm">Slug</label>
                                <input value={glossarySlug} onChange={e => setGlossarySlug(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm">Description</label>
                                <textarea value={glossaryDescription} onChange={e => setGlossaryDescription(e.target.value)} className="w-full border px-3 py-2 h-24" />
                            </div>
                            <div>
                                <button className="px-4 py-2 bg-honey text-white rounded">Add Glossary</button>
                            </div>
                        </form>
                    )}

                    {tab === 'videos' && (
                        <form onSubmit={createVideo} className="space-y-3">
                            <div>
                                <label className="block text-sm">Title</label>
                                <input value={videoTitle} onChange={e => setVideoTitle(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm">Slug</label>
                                <input value={videoSlug} onChange={e => setVideoSlug(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm">YouTube URL</label>
                                <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <button className="px-4 py-2 bg-honey text-white rounded">Add Video</button>
                            </div>
                        </form>
                    )}

                    {tab === 'profile' && (
                        <form onSubmit={saveProfile} className="space-y-3">
                            <div>
                                <label className="block text-sm">Name</label>
                                <input value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full border px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm">Bio</label>
                                <textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} className="w-full border px-3 py-2 h-24" />
                            </div>
                            <div>
                                <button className="px-4 py-2 bg-honey text-white rounded">Save Profile</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <section className="mt-8">
                <h2 className="font-semibold">既存記事</h2>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {files.map(f => (
                        <div key={f.sha} className="p-3 border rounded flex justify-between items-center">
                            <div>{f.name}</div>
                            <div className="flex gap-2">
                                <button onClick={() => editArticle(f)} className="px-3 py-1 text-sm border rounded">編集</button>
                                <button onClick={() => deleteArticle(f)} className="px-3 py-1 text-sm border rounded text-red-600">削除</button>
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
