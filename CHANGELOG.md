# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Added

- The repository presents itself as it is. The README became a front page — pitch,
  badges, a table of contents and user-facing sections — and issue forms plus a
  pull-request template now ask for the evidence this project acts on: what was
  run, what was expected, and how "done" would be able to fail.
- Governance layer brought to the family standard: `CONTRIBUTING.md`,
  `SECURITY.md`, `CODE_OF_CONDUCT.md`, `AGENTS.md`, `.editorconfig`,
  `.gitattributes` and `CODEOWNERS`.

### Removed

- **The repository contract gate does not travel to the template.**
  `scripts/check-repo-contract.py`, `scripts/check-repo-contract_test.py`,
  `scripts/repo-contract.json` and the CI step that ran them are gone, reversing
  the 2026-10-13 pull requests #5–#7. The gate identifies a repository by
  **directory name** (`repo = root.name`), and a template is cloned precisely so
  that the directory is renamed — to the new project's name, which by definition
  is not in the shared list of sixteen repositories. Measured on a fresh clone:
  named after the repository the gate reported `contract satisfied (37
  assertions)`; named anything else — including a new project pushed to its own
  remote — it failed with exit 1, `repository '<name>' has no type in the
  contract`. That is the one state in which a template promises to be green.
  CI never saw it because `actions/checkout` always clones into a directory
  named after the repository.

  The governance documents stay. They are what a generated project needs
  whatever its name, and only the checker was the problem. A project gets the
  gate when it joins the shared contract as an entry of its own.

### Fixed

- `README-testing.md` was unreachable from the README in every bot of the family
  except one. A document nobody can reach is a document nobody reads; it is linked
  from the front page now.

### Changed

- Line endings are pinned to LF by `.gitattributes`, so a CRLF contributor no
  longer turns every touched line into a diff.

## [] — 2026-10-06

Project running in production. See the git history for the work preceding this
entry; the changelog starts here because the repository had none.
