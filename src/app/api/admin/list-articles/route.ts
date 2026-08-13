import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OWNER = process.env.GITHUB_OWNER || '';
const REPO = process.env.GITHUB_REPO || '';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function GET(req: NextRequest) {
    if (!GITHUB_TOKEN || !OWNER || !REPO) return NextResponse.json({ message: 'GitHub not configured' }, { status: 500 });
    const path = 'content/articles';
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}${BRANCH ? `?ref=${encodeURIComponent(BRANCH)}` : ''}`;
    const res = await fetch(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' }
    });
    const j = await res.json();
    if (!res.ok) return NextResponse.json({ message: 'GitHub API error', detail: j }, { status: 500 });
    // return list of files
    const files = (j || []).filter((f: any) => f.type === 'file').map((f: any) => ({ name: f.name, path: f.path, sha: f.sha }));
    return NextResponse.json({ files });
}
