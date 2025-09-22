# Agent Playbook

## 1. Orient
- Read `.kiro/steering/*.md` before every task to understand product goals, branching rules, tech constraints, and global policies.
- Review the active spec set (`.kiro/specs/<feature>/`) and ensure the relevant `tasks.md` entry is understood before making changes.

## 2. Plan
- For each piece of work capture or update the plan in the appropriate spec task; note expected tests and documentation touch points.
- Propose new dependencies or tooling during the planning phase and secure explicit user approval before implementation.
- Keep the design → plan → execute cycle: do not start coding without confirming scope and approach in the specs/tasks.
- **No plan, no code:** Before editing any source file, confirm the change has already been designed, documented in the relevant spec/task (with planned tests/docs), and reviewed/acknowledged by the user. If that preparation is missing, pause and capture it first—no exceptions.

## 3. Implement
- Work within the documented repository structure (`docs/DEVELOPMENT.md`) and respect size policies (300 lines per file, 50 per function) and quality gates (lint, tests, build).
- Use the build CLI (`build/build.js`) and npm scripts for running quality checks; watch mode may skip gates only when approved.
- Surface build/warning output in summaries so the user sees policy violations and follow-up items.

## 4. Document & Handover
- After completing a task, update affected docs (specs, design notes, README references) and record new findings or follow-ups in the spec task list.
- Summaries should include what changed, quality checks run, outstanding warnings, and next-step suggestions.
