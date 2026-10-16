# Contributing

## Setup

Node 24 LTS and npm 11 (`nvm use`, then `npm i -g npm@11` if needed).

```bash
npm ci
npm run dev
```

## Before pushing

```bash
npm run verify   # typecheck, lint, test, build
npm run format:check
```

## Branches and commits

- Branch from `main`: `feat/…`, `fix/…`, `chore/…`, `docs/…`.
- Conventional Commits (`feat(search): add stop filter`).
- One concern per pull request. CI must pass before merge.

## Code standards

- Strict TypeScript; `any` needs a justification comment.
- Business rules are pure functions with unit tests, including failure cases.
- Supplier-specific code stays inside `apps/api/src/providers/<name>/`.
- UI text goes through translation keys; no hard-coded user-facing strings.
- Never add a dependency for something a few lines of code can do. Record
  why a new dependency was chosen in the pull request.
