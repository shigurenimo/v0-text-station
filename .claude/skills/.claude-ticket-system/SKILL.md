---
name: claude-ticket-system
description: .claude/tickets/ directory format and status management for local issue tracking
user-invocable: false
---

# Claude Tickets

`.claude/tickets/` に格納するチケットの仕様。

## File Naming

Format: `{number}.YYYY-MM-DD.{slug}.md`

- Number is a zero-padded sequential integer (e.g., `001`, `002`). Determine the next number by scanning existing files in `.claude/tickets/`.
- Date must match `created-at` in FrontMatter.
- Slug uses lowercase letters and hyphens only.

## FrontMatter

Required:

- `status` - See "Status" for valid values.
- `type` - `bug`, `feature`, `refactor`, `docs`, `chore`.
- `priority` - `high`, `medium`, or `low`.
- `created-at` - `YYYY-MM-DD` format.

Optional:

- `closed-at` - Date when the ticket was closed. `YYYY-MM-DD` format.
- `closed-reason` - Free text explaining why the ticket was closed.

## Status

Format: `{phase}_{state}`

Phases:

- `plan` - Investigate, design, and define the approach.
- `code` - Execute code changes and commit.

States:

- `pending` - Waiting for user approval.
- `in_progress` - Work in progress.
- `completed` - Done. Waiting for user confirmation.
- `blocked` - Requires human decision.

Terminal statuses: `closed`, `closed-as-not-planned`, `closed-as-duplicate`

Progression: `plan_pending` → `plan_in_progress` → `plan_completed` → `code_pending` → `code_in_progress` → `code_completed` → `closed`

Any status can transition to `{phase}_blocked`. Unblocking returns to the previous status.

Any status can transition to a terminal status. Set `closed-at` and `closed-reason` when closing.

Reopen: terminal status から `{phase}_{state}` に戻す場合、`closed-at` と `closed-reason` を削除する。

## Ticket Body

The body is divided into up to 5 sections separated by `---`. Always insert a blank line before and after `---`. Sections are added as the ticket progresses.

- `# Blocked Reason` or `# Close Reason` - At most one, at the top.
- `# Context` - 非技術的な課題。何を・なぜ。
- `# Issue` - 技術的な課題。影響するファイル・API・実装上の懸念。
- `# Plan`
- `# Code`

See `templates/` for each section's fixed headings and structure:

- [blocked-reason.md](templates/blocked-reason.md)
- [close-reason.md](templates/close-reason.md)
- [context.md](templates/context.md)
- [issue.md](templates/issue.md)
- [plan.md](templates/plan.md)
- [code.md](templates/code.md)

Example:

```markdown
---
status: closed
type: feature
priority: high
created-at: 2026-02-15
closed-at: 2026-02-17
closed-reason: 要件通りに実装完了
---

# Context

Add the ability to delete posts.

## Requirements

- Users can delete their own posts
- Deleted posts are no longer visible

---

# Issue

- `posts` テーブルに `deleted_at` カラムが存在しない
- `GET /api/posts` のクエリが物理削除を前提にしている
- `post-detail.tsx` に削除 UI がない

---

# Plan

Use soft delete with a `deleted_at` column.

## Tasks

- [x] Add delete button
- [x] Implement delete API
- [x] Add tests

---

# Code

Implemented soft delete with `deleted_at` column.

## Verification

- [x] Delete button appears on post detail page
- [x] Post is removed after deletion
- [x] Deleted post returns 404
```

## Priority Order

- `high` → `medium` → `low`.
- Same priority: lowest sequential number first.
