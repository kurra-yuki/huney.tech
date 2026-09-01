# Huney AI Agent Instructions

## Project

Project: Huney Webサイト構築プロジェクト  
Service: はちみつと学ぶIT  
Domain: huney.uk

Huney is an IT learning website for beginners.

The most important product principle is:

> 迷ったら、初心者にとって分かりやすい方を選ぶ。

The website should remain simple, readable, maintainable, and easy to publish content to.

---

# 1. Read Before Working

Before making changes, read the following files.

```text
docs/07_プロジェクト管理/03_管理ルール.md
docs/07_プロジェクト管理/01_プロジェクト管理.md
docs/07_プロジェクト管理/02_課題管理.md
```

Then read the documents related to the task.

```text
docs/01_ブランド/
docs/02_要件定義/
docs/03_基本設計/
docs/04_詳細設計/
docs/05_テスト/
docs/06_運用/
```

Do not begin a large implementation without reviewing the relevant design documents.

---

# 2. Source of Truth

Use the following order when understanding the intended system.

```text
Brand / Product concept
↓
Requirements
↓
Basic design
↓
Detailed design
↓
Current implementation
```

Do not assume that the current source code is automatically correct.

However, do not automatically assume that the design documents are always correct either.

If the design and implementation conflict, investigate the reason before changing either side.

If a product or specification decision is required, register an issue instead of deciding independently.

---

# 3. Project Management

Project progress is managed in:

```text
docs/07_プロジェクト管理/01_プロジェクト管理.md
```

When starting a task:

1. Find the relevant Task ID.
2. Change its status from `未着手` to `進行中` when appropriate.
3. Update progress percentage if useful.

When completing a task:

1. Confirm the implementation is complete.
2. Run the required tests.
3. Update related design documents if necessary.
4. Only then change the task status to `完了`.
5. Set progress to `100%`.

If human review is required, use:

```text
レビュー待ち
```

Do not mark unfinished work as complete.

---

# 4. Issue Management

Issues are managed in:

```text
docs/07_プロジェクト管理/02_課題管理.md
```

Register an issue when discovering:

- Requirement ambiguity
- Design inconsistency
- Implementation bugs
- Build failures
- Test failures
- Infrastructure problems
- SEO problems
- Security problems
- Problems blocking MVP release
- Decisions requiring human judgment

Do not create issues for every trivial typo or obvious one-line fix.

---

# 5. Issue IDs

Use:

```text
I-XXX
```

Generate a new ID using the current maximum Issue ID + 1.

Never reuse an existing Issue ID.

Link issues and tasks in both directions.

Example:

```text
Task T-018
Related Issue: I-005
```

and:

```text
Issue I-005
Related Task: T-018
```

---

# 6. Human Decisions

Do not independently decide major product changes.

Human approval is required for:

- Major MVP scope changes
- New major features
- Database introduction
- CMS introduction
- Authentication
- Payments
- Paid external services
- New infrastructure architecture
- Major URL structure changes
- Brand changes
- Collection of personal information
- Large architectural rewrites

If one of these is required:

1. Register an issue.
2. Set it to `保留` if necessary.
3. Report why a decision is required.

---

# 7. MVP Rules

The MVP should remain small.

Do not add features only because they may be useful in the future.

The current MVP should not require:

- User registration
- Login
- Comments
- Favorites
- Learning history
- Question banks
- Payments
- Membership
- Complex CMS
- Database
- AI chat

Do not add these unless the specification is formally changed.

---

# 8. Database Rule

Huney MVP does not use a database.

Content should primarily use:

```text
Markdown / MDX
```

Do not independently introduce:

- PostgreSQL
- Supabase
- Firebase
- DynamoDB
- SQLite
- Other databases

If a database becomes necessary, create an issue and wait for approval.

---

# 9. Content Philosophy

Huney articles are primarily text-based.

Articles must be able to work without:

- Images
- Thumbnails
- YouTube videos

Images are optional.

YouTube is supplementary.

Use this model:

```text
Web article
→ read and understand

Glossary
→ quickly look up a term

YouTube
→ visually understand with diagrams/video
```

Do not make image or video production a requirement for publishing an article.

---

# 10. Brand Rules

Huney is beginner-focused.

The main character is not a teacher.

The character acts as:

```text
a companion / guide learning together with the reader
```

The main subject is IT knowledge, not the character.

Avoid making the character dominate the UI.

---

# 11. Writing and UX Principles

Prioritize:

1. Beginner comprehension
2. Readability
3. Simple navigation
4. Mobile usability
5. Maintainability
6. Brand consistency

Avoid UI complexity that does not improve learning.

---

# 12. Existing Code

Before changing existing code:

1. Inspect the current implementation.
2. Check whether the feature already exists.
3. Compare it with the design.
4. Reuse valid existing implementation where possible.

Do not rewrite the project from scratch unless explicitly required.

Prefer the smallest safe change.

---

# 13. Refactoring

Do not perform unrelated large refactors during a task.

If a large refactor is necessary:

- Explain why
- Check the affected scope
- Create a separate Task if appropriate
- Register an Issue when there is meaningful risk or design impact

---

# 14. Dependencies

Before adding a package, check whether:

1. It is actually required.
2. Native Next.js / JavaScript features can solve the problem.
3. An existing dependency already solves it.
4. The package is actively maintained.
5. It introduces unnecessary complexity.

Do not add dependencies casually.

---

# 15. Secrets

Never commit:

- GitHub tokens
- API keys
- Passwords
- Access tokens
- Secrets
- Private personal information
- Environment variable values

Use environment variables when secrets are required.

Do not commit secret `.env` files.

---

# 16. Implementation Scope

Only modify files necessary for the current task unless there is a clear reason to do otherwise.

Avoid unrelated changes.

Preserve existing user-authored content and documentation.

---

# 17. Testing

Use the test specification under:

```text
docs/05_テスト/
```

After implementation, run tests relevant to the change.

At minimum, where applicable, check:

- Build
- TypeScript
- Target page/function
- Related pages
- Mobile layout
- Error handling
- SEO behavior

If tests fail, do not mark the Task as complete.

---

# 18. Design Document Updates

If implementation changes external behavior or specifications, update the relevant documents.

Examples:

```text
Requirement change
→ 要件定義

Screen behavior change
→ 基本設計 / 画面詳細設計

Data structure change
→ コンテンツ・データ設計

Processing change
→ 処理設計

SEO/error behavior change
→ SEO・エラー設計
```

Minor internal refactoring does not require documentation updates.

---

# 19. Error Handling

Do not expose technical internals to end users.

Do not expose:

- Stack traces
- File system paths
- Environment variables
- Secrets
- Internal infrastructure details

Draft content must not be publicly accessible in Production.

---

# 20. Production Safety

Prefer this workflow:

```text
Local
↓
Preview
↓
Review
↓
Production
```

Do not use destructive Git operations unnecessarily.

Be especially careful with:

- force push
- reset
- deleting large groups of files
- overwriting user changes

---

# 21. Work Completion Checklist

Before finishing a task, confirm:

```text
[ ] Relevant Task updated
[ ] Relevant Issues updated
[ ] Required implementation completed
[ ] Tests executed
[ ] Design docs updated if needed
[ ] No unnecessary features added
[ ] No secrets committed
[ ] Remaining human-review items identified
```

---

# 22. Final Work Report

At the end of a meaningful task, report:

- What was implemented
- Files changed
- Tests performed
- Task IDs updated
- Issue IDs added/updated
- Remaining issues
- Human review required, if any

Keep the report concise.

---

# 23. Standard Agent Workflow

Use the following workflow:

```text
1. Read AGENTS.md
2. Read project management rules
3. Read project task table
4. Read issue table
5. Identify the target Task
6. Read related design documents
7. Inspect current source code
8. Update Task to in-progress when appropriate
9. Implement the minimum necessary change
10. Register Issues if needed
11. Run relevant tests
12. Update design documents if specifications changed
13. Update Task / Issue status
14. Report the result
```

---

# 24. Final Principle

Project management is not the goal.

The goal of Huney is:

> 初心者がITを学びやすいWebサイトを作り、学んだ知識を継続して発信すること。

Use documentation, project management, and AI assistance only to support that goal.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
