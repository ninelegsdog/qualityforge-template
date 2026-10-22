# AGENTS.md

Rules for coding agents working in this repository. Read before changing code.

## What this repository is

A **template**: a small Playwright project that consumes a pinned, packaged
`qualityforge` release from npm. It is green from a fresh clone, and every
claim its README makes is meant to be checkable.

It is not the product. The product lives in `ninelegsdog/qualityforge`; this
repository must never reach into that tree.

## Hard rules

1. **Never replace the npm pin with a branch, a `file:` link, or a path into a
   local qualityforge checkout.** The whole point of the pin is that a fresh
   clone installs exactly one known release without any local arrangement.
   A verification run that only passes against a working tree proves nothing
   about the template.
2. **Never hand-edit `package-lock.json`.** Move the pin with
   `npm install --save-dev --save-exact qualityforge@<version>` and let npm
   rewrite the lock.
3. **Never commit `test.only()` or `describe.only()`.** It silently skips the
   rest of the suite.
4. **Never use `page.waitForTimeout()`.** Wait for a real condition:
   `expect(locator).toBeVisible()`, `waitForURL`, `waitForResponse`.
5. **Never commit evidence output.** `artifacts/`, `test-results/`,
   `playwright-report/` are ignored on purpose. `quality-history/` is the one
   deliberate exception: one compact record per run, committed.
6. **Never let the README carry a placeholder, a stale number, or an unfilled
   bracket.** The contract gate reads the README and fails on `TODO`,
   `{{ … }}` and unfilled angle brackets for exactly this reason.
7. **Never report green from a check that did not run.** If the contract check
   cannot find its contract, it exits `2`, which is not success. Read exit
   codes, never greps.

## The checks this repository carries

```bash
python3 scripts/check-repo-contract.py . scripts/repo-contract.json  # the family contract
python3 scripts/check-repo-contract_test.py                          # proof the contract check can fail
python3 scripts/check-links.py .                                     # every relative link resolves
```

The contract check keys the repository type by **directory name**, so it must be
run from a checkout named `qualityforge-template` — which is what a clone gives
it, and what CI runs it from.

`scripts/repo-contract.json` is a copy of the family contract, same as every
other repository in the family. When the family contract changes upstream, this
copy is updated deliberately, not diverged.

## Before you finish

Run and show the output of:

```bash
python3 scripts/check-repo-contract.py . scripts/repo-contract.json
python3 scripts/check-repo-contract_test.py
python3 scripts/check-links.py .
npm test
npm run quality
```

Do not report a task as done on the basis of a green build alone. Confirm the
observable behaviour: the test ran, and it failed when the thing it guards was
broken. **Check the exit code, not a line of output.**
