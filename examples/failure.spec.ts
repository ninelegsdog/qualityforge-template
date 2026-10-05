import { expect, test } from "qualityforge/fixtures/quality-context.js";

/**
 * Deliberately wrong, and outside `testDir`, so `npm test` never runs it.
 *
 * `npm run demo` runs it, fails, and collects the result: what comes out is a
 * defect artifact carrying the console error and the 500 the button produced,
 * which is the thing this package exists to give you.
 */
test("the revenue dashboard heading that was never built", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Report a problem" }).click();

  await expect(page.getByRole("heading", { name: "Revenue dashboard" })).toBeVisible();
});
