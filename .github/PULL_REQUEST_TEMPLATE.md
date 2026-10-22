## What and why

What does this change, and why does it need to exist? One paragraph. The diff
shows the what; this is the why — the decision, the constraint, the observed
behaviour that made the change necessary.

## Verification

- [ ] `npm test` passes locally
- [ ] `npm run quality` passes locally (suite, collect, then the gate)
- [ ] `python3 scripts/check-repo-contract.py . scripts/repo-contract.json` passes
- [ ] `python3 scripts/check-links.py .` passes

If the change adds or modifies a check, a rule, or a claim about behaviour:
what did you **break on purpose** to confirm it can fail, and what did that
run output? A check that has never failed is an unverified assumption — the
CI conclusion is read from the exit code, not from grepping output.

## Notes for the reviewer

- One concern per pull request.
- Conventional Commits on the squash commit: `feat:`, `fix:`, `docs:`,
  `test:`, `chore:`, `security:`, `refactor:`.
- If behaviour or commands changed, `CHANGELOG.md` is updated under
  `[Unreleased]`.
- If the pinned `qualityforge` version moved, say which release it moved to,
  why, and paste the verbatim output of the runs above. "The agent says it
  passes" is not evidence.
- If this was AI-assisted, say which parts were agent-generated and paste the
  verbatim output of the verification commands.
