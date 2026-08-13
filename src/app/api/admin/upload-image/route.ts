import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);

export async function POST(req: NextRequest) {
    const auth = req.headers.get('authorization') || '';
    const m = auth.match(/^Bearer (.+)$/);
    const token = m ? m[1] : null;
    if (!token) return NextResponse.json({ message: 'Missing token' }, { status: 401 });

    const { data: userData, error } = await supabaseServer.auth.getUser(token);
    if (error || !userData?.user) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    const email = userData.user.email || '';
    if (!ADMIN_EMAILS.includes(email)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { filename, content, contentType } = body as { filename: string; content: string; contentType?: string };
    if (!filename || !content) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

    // decode base64
    const buffer = Buffer.from(content, 'base64');

    const key = `articles/${filename}`;
    try {
        const { data, error: upErr } = await supabaseServer.storage.from('articles').upload(key, buffer, { upsert: true, contentType: contentType || 'application/octet-stream' });
        if (upErr) return NextResponse.json({ message: 'Storage upload error', detail: upErr.message }, { status: 500 });
        const pub = supabaseServer.storage.from('articles').getPublicUrl(key);
        return NextResponse.json({ ok: true, publicUrl: pub.data.publicUrl, data });
    } catch (e: any) {
        return NextResponse.json({ message: 'Upload failed', detail: e.message }, { status: 500 });
    }
}
