import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = process.env.GITHUB_OWNER || '';
const REPO = process.env.GITHUB_REPO || '';

export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug) return NextResponse.json({ message: 'Missing slug' }, { status: 400 });
    if (!GITHUB_TOKEN || !OWNER || !REPO) return NextResponse.json({ message: 'GitHub not configured' }, { status: 500 });
    const path = `content/articles/${slug}.md`;
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' }
    });
    const j = await res.json();
    if (!res.ok) return NextResponse.json({ message: 'GitHub API error', detail: j }, { status: 500 });
    const content = Buffer.from(j.content || '', 'base64').toString('utf-8');
    return NextResponse.json({ content, sha: j.sha });
}
