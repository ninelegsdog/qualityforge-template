# qualityforge-template

Playwright and [QualityForge](https://github.com/ninelegsdog/qualityforge)
together, green from a fresh clone: your suite runs, and every failure it finds
becomes a normalized artifact carrying what the page was doing while it failed —
console errors, uncaught page errors, failed requests, a screenshot and a video.

[![CI](https://github.com/ninelegsdog/qualityforge-template/actions/workflows/ci.yml/badge.svg)](https://github.com/ninelegsdog/qualityforge-template/actions)
[![License](https://img.shields.io/github/license/ninelegsdog/qualityforge-template.svg)](LICENSE)

## Contents

- [Quick start](#quick-start)
- [See what a failure is worth](#see-what-a-failure-is-worth)
- [Where things live](#where-things-live)
- [Point it at your application](#point-it-at-your-application)
- [Commands](#commands)
- [Letting an agent read the evidence](#letting-an-agent-read-the-evidence)
- [Contributing](#contributing)
- [Requirements](#requirements)

## Quick start

```bash
npm ci
npx playwright install --with-deps chromium
npm test
```

No configuration is needed for a first run. `npm test` starts the stub
application in `app/`, runs the suite against it, and stops the server.

## See what a failure is worth

```bash
npm run demo
```

This run is **supposed to fail**, and it ends with a non-zero exit code — the
quality gate refuses a 100% failure rate, which is the gate working. What it
leaves behind is the point:

```text
artifacts/defects/<runId>/
  quality-summary.v1.json
  the-revenue-dashboard-heading-that-was-never-built.v1.json
```

The defect artifact carries the failure message with its call log, the console
error the button printed, the 500 it asked for, and pointers to the screenshot
and video. The demo is outside `testDir`, so a plain `npm test` never sees it,
and it does not touch `quality-history/` — a deliberate failure must not sit in
your history as a regression forever.

## Where things live

| Path                  | What it is                                                              |
| --------------------- | ----------------------------------------------------------------------- |
| `tests/`              | Your tests. This is the suite `npm test` runs.                          |
| `examples/`           | The deliberately failing demo, run only by `npm run demo`.              |
| `app/`, `server.mjs`  | A stub application to delete once you point at your own.                |
| `config/project.json` | Origin under test, evidence policy, gate thresholds, where artifacts go |
| `artifacts/`          | Output of every run. Ignored, like every other run's output.            |
| `quality-history/`    | One compact record per run. Committed, on purpose — see below.          |

`quality-history/` is the only output that belongs in git. A pass rate nobody
kept is worth less than the bytes: each entry is a few hundred bytes of counts
plus a hash of the specs that ran, and together they are what turns "is this a
regression" from a guess into an answer.

## Point it at your application

1. Set `baseUrl` in `config/project.json`, and the thresholds you actually want
   — `maxFailureRate` defaults to 5% here.
2. Put your tests under `tests/` and import them from the fixture:

   ```ts
   import { expect, test } from "qualityforge/fixtures/quality-context.js";
   ```

   That one line is what turns on console, page-error and network capture.
   It is a compiled path rather than a source path because Playwright refuses
   to transpile TypeScript inside `node_modules`, and the package's `exports`
   map publishes it — `qualityforge/dist/…` is refused on purpose, because
   internal layout is not the contract.

3. Delete `app/` and `server.mjs`, and either drop the `webServer` block from
   `playwright.config.ts` (if your app is already running) or point it at your
   own start command.

The reporter path in `playwright.config.ts` is a contract with the collector:
`npm run collect` reads exactly `artifacts/json/playwright-results.json`, and
rather than collecting nothing if that file is missing, it refuses and says so.

## Commands

| Command        | What it does                                                        |
| -------------- | ------------------------------------------------------------------- |
| `npm test`     | The suite, against the app in `app/`                                |
| `npm run demo` | A run that fails on purpose, then collects the evidence — exits `1` |
| `npm run quality` | Suite, then collect, then the gate; fails if either failed       |
| `npm run collect` | Turn the last run's report into artifacts and a history entry    |
| `npm run serve`  | Start the stub app on its own                                    |
| `npm run mcp`    | The read-only MCP server on stdio                                |

`npm run collect` is the quality gate: `0` when the gate passes, `1` when a
threshold is violated, `2` when collection could not run at all — a missing
report, an invalid config. It never guesses.

## Letting an agent read the evidence

The MCP server is read-only and speaks protocol 2026-07-28. `opencode.json` in
this repository already configures it for OpenCode; in your own project the
block is:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "qualityforge": {
      "enabled": true,
      "type": "local",
      "command": ["npx", "--no-install", "qualityforge-mcp"]
    }
  }
}
```

`--no-install` runs the binary out of `node_modules/.bin` and refuses to go to
the registry when it is not there: a tool run must not depend on the network,
and a dependency that is not installed locally is a failure worth seeing rather
than something to fetch silently.

It refuses to start until there is evidence to read, which is deliberate: run
the suite and `npm run collect` first. What it then answers:

| Tool                         | What it answers                                                          |
| ---------------------------- | ------------------------------------------------------------------------ |
| `quality_get_latest_run`     | Pass and fail counts, duration, gate verdict, and every dimension's verdict |
| `quality_list_failures`      | Compact records: id, status, test location, flakiness                     |
| `quality_get_defect`         | One defect in full, including console, network and signals                |
| `quality_flaky_tests`        | Which specs failed across runs: flaky, failing, new, or gone              |
| `quality_get_trend`          | Pass rate per run, direction, duration, distinct failures                 |
| `quality_list_audits`        | Accessibility audits on record, newest first, and whether they are clean  |
| `quality_get_audit`          | One accessibility audit in full, every rule's kept-against-real node count |
| `quality_list_visual_audits` | Appearance audits per run, with the approving engine                      |
| `quality_get_visual_audit`   | Every page, its hash, and what was approved against what was seen         |
| `quality_list_perf_audits`   | Per run: budgets, tests, pages, violations, and whether it passed         |
| `quality_get_perf_audit`     | One run in full: every declared budget, what each page cost, its violations |
| `quality_list_api_audits`    | Contract audits, newest first: expectations, tests, violations, passed    |
| `quality_get_api_audit`      | One contract run in full, and every violation in it                       |

The last eight read the four audit evidence directories — `artifacts/audit`,
`artifacts/api`, `artifacts/perf` and `artifacts/visual` — or the roots you pass
with `--audit-root`, `--api-root`, `--perf-root` and `--visual-root`. This
template's suite produces defect evidence under `artifacts/defects`; the audit
directories stay empty until you run those audits yourself.

## Contributing

This repository carries its own copy of the family repository contract, and CI
runs it before anything is installed:

```bash
python3 scripts/check-repo-contract.py . scripts/repo-contract.json
python3 scripts/check-links.py .
```

The contract is keyed by the checkout directory name, which a clone gives as
`qualityforge-template`. Contribution rules are in
[CONTRIBUTING.md](CONTRIBUTING.md), rules for coding agents in
[AGENTS.md](AGENTS.md), and the release history in [CHANGELOG.md](CHANGELOG.md).
Security problems never go to a public issue: [SECURITY.md](SECURITY.md) has the
private path. Conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Requirements

Node.js 22 or newer. Linux is what CI runs and therefore what is verified;
macOS and Windows should work and have not been tested.
