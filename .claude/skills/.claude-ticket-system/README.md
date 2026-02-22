# Claude Tickets

Local-first ticket management for AI-assisted development.

## Philosophy

Tickets are conversations between a human and an AI, not traditional issue trackers. The human decides what and why. The AI plans how and executes.

Every ticket follows a simple loop: plan, then code. Each phase requires human approval to start. The AI never acts without permission.

## Design Decisions

Flat files over databases. A ticket is a single Markdown file. No external dependencies, no servers, no sync. Easy to read, diff, and version control.

Two phases, one status field. `plan` and `code` are sequential, not parallel. A combined `{phase}_{state}` status makes the current position unambiguous.

Sections over fields. Ticket content is divided by `---` separators, not structured metadata. This keeps the format flexible and human-writable.

Templates as item lists, not rigid structures. Each template lists possible items. Use what you need, skip what you don't. Promote items to headings when they grow.

Blocked as a first-class state. When progress stops, the reason appears at the top of the ticket. When resolved, it disappears. The ticket always reflects the current truth.
