# qualityforge-template

Playwright and [QualityForge](https://github.com/ninelegsdog/qualityforge)
together, green from a fresh clone: your suite runs, and every failure it finds
becomes a normalized artifact carrying what the page was doing while it failed —
console errors, uncaught page errors, failed requests, a screenshot and a video.

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
   import { expect, test } from "qualityforge/dist/fixtures/quality-context.js";
   ```

   That one line is what turns on console, page-error and network capture.
   It is a compiled path rather than a source path because Playwright refuses
   to transpile TypeScript inside `node_modules`.

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
      "command": ["npx", "tsx", "node_modules/qualityforge/src/mcp/index.ts"]
    }
  }
}
```

It refuses to start until there is evidence to read, which is deliberate: run
the suite and `npm run collect` first. What it then answers:

| Tool                     | What it answers                                              |
| ------------------------ | ------------------------------------------------------------ |
| `quality_get_latest_run` | Pass and fail counts, duration, whether the gate passed      |
| `quality_list_failures`  | Compact records: id, status, test location, flakiness        |
| `quality_get_defect`     | One defect in full, including console, network and signals   |
| `quality_flaky_tests`    | Which specs failed across runs: flaky, failing, new, or gone |
| `quality_get_trend`      | Pass rate per run, direction, duration, distinct failures    |

## Requirements

Node.js 22 or newer. Linux is what CI runs and therefore what is verified;
macOS and Windows should work and have not been tested.
