import { defineConfig } from "@playwright/test";

/**
 * The report path is a contract with `config/project.json` by way of the
 * collector, which reads exactly this file. Change one and you must change the
 * other, and `npm run collect` will refuse to run rather than collect nothing.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["json", { outputFile: "artifacts/json/playwright-results-TYPO.json" }],
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
    reuseExistingServer: !process.env.CI,
  },
});
