# Security Policy

## Reporting a vulnerability

**Do not open a public issue.**

Use GitHub's private vulnerability reporting for this repository, or contact
the maintainer directly (see `CODEOWNERS`). Include:

- what the issue is and what an attacker gains;
- steps to reproduce;
- the affected commit.

You should get an acknowledgement within a few days. Confirmed issues are
fixed on `main`, and the reporter is credited unless they prefer otherwise.

## Scope

This repository ships no released artefacts of its own — it is a template that
others copy. In scope:

- anything in this repository that executes on a developer's machine or in CI:
  the CI workflow and its permissions, `server.mjs`, the example specs, and the
  scripts under `scripts/`;
- a compromised or squatted dependency name reachable through `package.json` or
  `package-lock.json`;
- a `qualityforge` release that behaves contrary to what this template documents
  about it.

Out of scope:

- vulnerabilities in `qualityforge` itself — report those to
  [its security policy](https://github.com/ninelegsdog/qualityforge/blob/main/SECURITY.md);
  this template consumes a published release and cannot fix the package;
- vulnerabilities in Playwright itself — report those to Microsoft;
- findings that require an attacker who already has write access to the
  repository;
- the application you point this template at: once you delete `app/` and
  `server.mjs`, your application's security is its own.

## Supported versions

There are no supported versions: this is a template, not a released product.
The supported state is the current `main`, together with the exact
`qualityforge` version pinned in `package.json` — read that file for the
version, not this document, so there is one source of truth rather than a
policy paragraph that ages.
