# Huney.tech

Minimal Next.js + TypeScript + Tailwind starter for the Huney.tech MVP.

Quick start:

```bash
git clone <repo>
cd huney.tech
npm install
npm run dev
```

Adding an article:

1. Create a markdown file under `content/articles/` with frontmatter:

```yaml
---
title: "記事タイトル"
description: "説明文"
slug: "slug"
date: "2026-08-13"
category: "ネットワーク"
tags: ["vlan"]
thumbnail: "/images/articles/example.jpg"
readingTime: 3
---

本文...
```

2. Start dev server (`npm run dev`) and visit `/articles`.
# huney.tech
