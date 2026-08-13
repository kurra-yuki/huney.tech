import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = process.env.GITHUB_OWNER || '';
const REPO = process.env.GITHUB_REPO || '';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function POST(req: NextRequest) {
    const { slug, content, sha } = await req.json();
    if (!slug || !content) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    if (!GITHUB_TOKEN || !OWNER || !REPO) return NextResponse.json({ message: 'GitHub not configured' }, { status: 500 });
    const path = `content/articles/${slug}.md`;
    const body = JSON.stringify({ message: `Update article ${slug}`, content: Buffer.from(content).toString('base64'), sha, branch: BRANCH });
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`, {
        method: 'PUT',
        headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' },
        body
    });
    const j = await res.json();
    if (!res.ok) return NextResponse.json({ message: 'GitHub API error', detail: j }, { status: 500 });
    return NextResponse.json({ ok: true, result: j });
}
