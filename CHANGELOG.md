# Changelog

All notable changes to this template are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-10-22

### Added

- **The family repository contract, in full.** The template now carries its own
  copy of `scripts/check-repo-contract.py`, `scripts/check-repo-contract_test.py`
  and `scripts/repo-contract.json` (this repository is typed `template`), plus
  every artefact that type requires: `.editorconfig`, `.gitattributes`,
  `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `AGENTS.md`,
  `CHANGELOG.md`, `.github/CODEOWNERS`, the pull-request template, both issue
  forms and `dependabot.yml`. The gate runs in CI before anything is installed,
  and its negative tests run beside it — a validator that has never been seen
  to fail is an assumption wearing the costume of a test.
- **`scripts/check-links.py`**, so a relative link that points at nothing fails
  the build instead of rendering as plain text on GitHub.

### Changed

- **qualityforge is pinned to the published `0.2.0` on npm**, an exact registry
  version instead of a `github:` tag ref. npm versions are immutable tarballs,
  which is a stronger pin than a mutable git tag, and `0.2.0` is what `latest`
  resolves to since 2026-10-21. The previous pin was
  `github:ninelegsdog/qualityforge#v0.1.0-alpha.1`.
- README gained its `Contents` section, the CI and license badges the contract
  expects, a Contributing section, a corrected rationale for `npx --no-install`
  (qualityforge has been on npm since 2026-10-15), and the full thirteen-tool
  MCP table as 0.2.0 exposes it — the five rows it carried described 0.1.0-alpha.
- CI runs the contract gate and the link check as first-class steps.

## [0.1.0] - 2026-10-06

### Added

- The template itself: a Playwright suite against a stub app in `app/`, a
  deliberately failing demo under `examples/`, the evidence collector as the
  quality gate, a committed `quality-history/`, and a read-only MCP server
  configured in `opencode.json`.
