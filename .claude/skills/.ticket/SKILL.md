---
name: ticket
description: "[number] Local ticket. Lists if omitted."
---

## Arguments

```
/ticket [number or slug]
```

No argument: invoke claude-ticket-system to list all tickets with status and priority, then exit.

With argument: invoke claude-ticket-system to fetch the ticket by number (e.g. `1`, `002`) or slug, then resume from its current status.

## Skills

Invoke via the Skill tool.

- claude-ticket-system: Ticket format, status transitions, and section templates.
- .agent-browser: Browser automation for verification.
- .docs-update: Sync product specifications with code changes.
- commit-commands: Commit, push, and open PRs.

## Team

Create a team named `ticket-{number}` and delegate work to teammates. This saves context in the main session.

| Role | Name | subagent_type | Purpose |
|---|---|---|---|
| Planner | `ticket-{number}-planner` | `planner-ticket` | Plan phase. Investigate codebase, write Issue and Plan sections. |
| Hacker | `ticket-{number}-hacker` | `hacker` | Security testing on localhost after implementation. |
| Code Debugger | `ticket-{number}-debugger-code` | `debugger-code` | Find code bugs and quality issues. |
| Docs Debugger | `ticket-{number}-debugger-docs` | `debugger-docs` | Find doc inconsistencies. |

## Exit conditions

Report to the user and exit when any of these is reached:

- `code_completed`: no more work to do. Report a summary of changes.
- `{phase}_blocked`: problem encountered. Present the cause and options.
- `cancelled`: user requested stop. Report the reason.

## Workflow

### Plan phase

Set status to `plan_in_progress`. Spawn `ticket-{number}-planner` and pass the ticket content. Prompt must include: "Plan this single ticket only. Do not loop to other tickets." The planner investigates the codebase, writes the Issue section and Plan section. Wait for the planner to finish. Set status to `plan_completed`.

### Approval gate

Present the Plan to the user and ask for approval.

- Approved: set status to `code_pending` and proceed.
- Rejected: set status to `plan_blocked`, add a Blocked Reason section, and exit.

### Code phase

Set status to `code_in_progress`. Implement changes following the task list. Check off tasks as completed. Commit as needed.

### Security phase (optional)

If the changes involve user input, authentication, or data handling, spawn `ticket-{number}-hacker` to run security testing on localhost.

### Verification

Before marking as complete, create a verification checklist covering all changes made. Use `.agent-browser` to verify each item by actually operating the application in the browser. All items must pass before proceeding.

### Docs update

Invoke `.docs-update` to sync product specifications in `.docs/` with the changes made. Commit the doc updates.

### Completion

Write the Code section. Set status to `code_completed`, set `closed-at`.

### Debug phase

After completion, spawn `ticket-{number}-debugger-code` and `ticket-{number}-debugger-docs` in parallel. They fix trivial issues on the spot and return non-trivial findings.

### Triage

Review findings from debuggers and triage each one. Ask the user how to handle each finding:

| Effort | Action |
|---|---|
| Trivial (typo, format) | Fix immediately and commit |
| Any non-trivial finding | Create a new ticket (.claude/tickets/) |

Maximum level for this skill: ticket. Do not create GitHub Issues or Notion tasks.

### Loop

After triage, if new tickets were created, pick the next actionable ticket and repeat from the Plan phase. Exit when there is nothing left to do. Shut down teammates.
