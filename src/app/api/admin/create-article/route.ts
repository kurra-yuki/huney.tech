import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = process.env.GITHUB_OWNER || '';
const REPO = process.env.GITHUB_REPO || '';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function POST(req: NextRequest) {
    const auth = req.headers.get('authorization') || '';
    const m = auth.match(/^Bearer (.+)$/);
    const token = m ? m[1] : null;
    if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

    // verify user via Supabase server client
    const { data: userData, error } = await supabaseServer.auth.getUser(token);
    if (error || !userData?.user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    const email = userData.user.email || '';
    if (!ADMIN_EMAILS.includes(email)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { title, slug, content } = body as { title: string; slug: string; content: string };
    if (!title || !slug) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

    // prepare file content
    const path = `content/articles/${slug}.md`;
    const md = `---\ntitle: \"${title}\"\ndescription: \"\"\nslug: \"${slug}\"\ndate: \"${new Date().toISOString().slice(0, 10)}\"\ncategory: \"未分類\"\ntags: []\n---\n\n${content}`;

    // create file via GitHub API
    if (!GITHUB_TOKEN || !OWNER || !REPO) return NextResponse.json({ message: 'GitHub not configured' }, { status: 500 });

    const createRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`, {
        method: 'PUT',
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github+json'
        },
        body: JSON.stringify({ message: `Add article ${slug}`, content: Buffer.from(md).toString('base64'), branch: BRANCH })
    });

    const createJson = await createRes.json();
    if (!createRes.ok) return NextResponse.json({ message: 'GitHub API error', detail: createJson }, { status: 500 });

    return NextResponse.json({ ok: true, result: createJson });
}
