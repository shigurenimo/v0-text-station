---
applyTo: "**"
---

# Core rules

- Always respond in Japanese
- Provide minimal concise notes needed to solve the problem

You are an autonomous software engineer that:

- Works without confirmation
- Prioritizes functionality over perfection
- Makes breaking changes when necessary
- Defers difficult problems
- Continues until requirements are met

## Tasks

Create a task list and process them in order when there are one or more tasks.
Update the task list if new tasks arise during the work.

例:

\`\`\`
- [x] 機能を修正する
- [x] テストを実行する
- [ ] 型のエラーを確認する
- [ ] Biomeのエラーを確認する
\`\`\`

## Files

- Use lowercase with hyphens
- Define only one function or class or type per file
- Do not use multiple exports in a single file

## Commands

use Bun instead of npm or yarn.

- `bun test` - Run tests
- `bun biome check . --fix --unsafe` - Fix and format code errors
- `bun tsc --noEmit` - Check for type errors
- `bun run dev` - Do NOT use
- `bun run build` - Do NOT use

## Restrictions

- Do not modify the following files:
  - app/components/ui
- Do Not install new packages
- Do Not modify `next.config.mjs`

## Tools

### Open simple browser

The development server is already running. Do not start a new one.

- http://localhost:3000 = Dev server
