import { defineConfig } from "@playwright/test";

/**
 * A run that is meant to fail, in its own config so that a plain `npm test`
 * never sees it. It writes its report elsewhere for the same reason: the
 * history is for what your suite really did, and a run whose failure is
 * deliberate would sit in it as a regression forever.
 */
export default defineConfig({
  testDir: "./examples",
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/json/playwright-demo-results.json" }],
  ],
  use: {
    baseURL: "http://127.0.0.1:4317",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:4317",
    reuseExistingServer: true,
  },
});
