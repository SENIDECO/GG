# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

---

## Repository Overview

**Organization:** SENIDECO
**Repository:** GG
**Remote:** `http://local_proxy@127.0.0.1:29822/git/SENIDECO/GG`
**Status:** FinanceMaster — Application complète de gestion de budget personnel (React + Vite).

---

## Git Workflow

### Branching Convention

- Feature/AI branches follow the pattern: `claude/<description>-<session-id>`
- Never push directly to `main` or `master` without explicit permission
- Always develop on the designated feature branch

### Standard Git Operations

```bash
# Push to a branch (always use -u on first push)
git push -u origin <branch-name>

# Fetch a specific branch
git fetch origin <branch-name>

# Pull changes
git pull origin <branch-name>
```

### Commit Message Style

Write clear, imperative commit messages:

```
Add user authentication module
Fix null pointer in payment processor
Update CLAUDE.md with test commands
```

- First line: short summary (≤72 chars), imperative mood
- Leave a blank line before the body if more detail is needed
- Body: explain *why*, not *what*

---

## Development Setup

**Stack:** React 18 + Vite 5 · CSS custom (no UI framework) · localStorage

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
GG/
├── CLAUDE.md
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx            # Entry point
    ├── App.jsx             # Root component + client-side routing
    ├── context/
    │   └── AppContext.jsx  # Global state (React Context)
    ├── components/
    │   ├── Navbar.jsx
    │   ├── MonthPicker.jsx
    │   └── TransactionModal.jsx
    ├── pages/
    │   ├── Dashboard.jsx   # Tableau de bord
    │   ├── Transactions.jsx
    │   ├── Budget.jsx
    │   ├── Reports.jsx
    │   └── Settings.jsx
    ├── utils/
    │   ├── storage.js      # localStorage helpers + defaults
    │   └── format.js       # Formatting helpers + CSV export
    └── styles/
        └── global.css
```

---

## Testing

> **TODO:** Document test framework, how to run tests, and coverage requirements once established.

- Run all tests before committing
- All tests must pass before pushing
- Add tests for any new functionality

---

## Code Conventions

> **TODO:** Update with language/framework-specific conventions once the stack is chosen.

General principles to follow regardless of stack:

- Keep functions small and focused
- Avoid over-engineering — solve the current problem, not hypothetical future ones
- Do not add error handling for scenarios that cannot happen
- Validate only at system boundaries (user input, external APIs)
- Prefer editing existing files over creating new ones
- Delete unused code rather than commenting it out

---

## Security

- Never commit secrets, credentials, API keys, or `.env` files
- Validate and sanitize all external inputs
- Avoid common vulnerabilities: SQL injection, XSS, command injection (OWASP Top 10)
- If insecure code is written, fix it immediately

---

## AI Assistant Instructions

When working in this repository:

1. **Read before editing** — always read a file before modifying it
2. **Stay minimal** — only change what is asked or clearly necessary
3. **No unsolicited refactors** — a bug fix does not require surrounding cleanup
4. **No unnecessary files** — do not create files unless absolutely required
5. **Keep this file current** — update CLAUDE.md whenever the project structure, tooling, or conventions change significantly
6. **Confirm before destructive actions** — deleting files/branches, force-pushing, dropping data
7. **Branch discipline** — develop on the designated branch; never push to main without permission

---

*Last updated: 2026-02-27 — FinanceMaster v1.0 added (React + Vite budget app)*
