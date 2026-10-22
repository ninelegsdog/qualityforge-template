# Contributing to qualityforge-template

Thanks for considering it. This repository is a **template**: a small Playwright
project that consumes a pinned, packaged `qualityforge` release. Its job is to
stay green from a fresh clone and to keep every claim in its README true, not to
grow features of its own.

## Getting set up

Requires **Node.js 22 or newer**.

```bash
git clone https://github.com/ninelegsdog/qualityforge-template.git
cd qualityforge-template
npm ci
npx playwright install --with-deps chromium
npm test
```

`npm test` starts the stub application in `app/`, runs the suite against it,
and stops the server. No other service is needed.

## Before opening a pull request

```bash
python3 scripts/check-repo-contract.py . scripts/repo-contract.json  # the family contract
python3 scripts/check-repo-contract_test.py                          # the contract's own negative tests
python3 scripts/check-links.py .                                     # every relative link resolves
npm test                                                             # the suite
npm run quality                                                      # suite, collect, then the gate
```

All five must pass. The contract check is keyed by the checkout directory name,
so a clone of this repository — which GitHub names `qualityforge-template` — is
the shape it expects.

If you touched a check, a rule, or a claim about behaviour: say in the
description which failure you broke on purpose to confirm it can fail. A check
that has never failed is an unverified assumption.

## Pull request rules

- One concern per pull request.
- Explain **why**, not just what. The diff already shows what.
- Use the pull-request template; it asks for the verification that makes a
  change reviewable.
- If behaviour or commands changed, update `CHANGELOG.md` under `[Unreleased]`.
- Conventional Commits for the commit subject: `feat:`, `fix:`, `docs:`,
  `test:`, `chore:`, `security:`, `refactor:`.

## Moving the qualityforge pin

The pin in `package.json` is exact and comes from the npm registry. It moves as
a deliberate, reviewed decision — never to a branch, never to a moving ref:

1. The release must already exist on npm (`npm view qualityforge versions`).
   A tag that has not been pushed, or a version that has not been published,
   is not a pin.
2. Bump it with `npm install --save-dev --save-exact qualityforge@<version>`
   so `package-lock.json` is regenerated rather than edited by hand.
3. Run every command in "Before opening a pull request" — the suite and the
   demo are what prove the template still works on that release.
4. Record the move in `CHANGELOG.md`.

Dependabot opens the same kind of pull request for each published release;
review it by the same rules.

## AI-assisted contributions

Fine, and encouraged. Two expectations:

1. Say which parts were agent-generated.
2. The agent must have actually run the commands above, and the output belongs
   in the description. "The agent says it passes" is not evidence.

## Reporting bugs

Use the bug-report issue form: it asks for what you ran, what you expected, what
happened, and the evidence. A failing test is the ideal bug report.

## Security

Do not open a public issue for a security problem. See `SECURITY.md`.

## Code of conduct

Be straightforward and assume good faith. See `CODE_OF_CONDUCT.md`.
