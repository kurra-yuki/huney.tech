Supabase + GitHub setup for Huney.tech

1) Supabase project
- Create a Supabase project at https://app.supabase.com
- In Auth > Settings > External OAuth Providers, enable GitHub and set Client ID / Secret.
- In Auth > Settings, add `http://localhost:3000` to `Site URL` and `Redirect URLs` for development.
- In Settings > API, copy `anon` key and `service_role` key.

2) GitHub
- Create a Personal Access Token (PAT) with `repo` scope so the server can create/update files.

3) Environment
- Create `.env.local` with values from `.env.local.example` and the keys you obtained.

4) Run locally
- `npm install`
- `npm run dev`

5) Admin usage
- Visit `/admin`, sign in via GitHub (Supabase OAuth), then create or edit articles.
