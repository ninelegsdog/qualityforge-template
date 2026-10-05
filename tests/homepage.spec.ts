import { expect, test } from "qualityforge/dist/fixtures/quality-context.js";

// That import is the whole integration. Everything else — console errors,
// uncaught page errors, failed requests — is captured automatically because
// the `signals` fixture is declared `auto`.

test("greets a visitor with a heading and a status", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "QualityForge template",
  );
  await expect(page.getByRole("status")).toHaveText("All systems nominal");
});

test("reporting a problem updates the status a screen reader announces", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Report a problem" }).click();

  await expect(page.getByRole("status")).toHaveText("Something went wrong");
});
