import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e-tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* The frontend served by nginx. */
    baseURL: "http://localhost:5173",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* Start the whole application (db, backend, frontend) with Docker compose.
   * The frontend only starts once the backend is healthy, so waiting for it is enough. */
  webServer: {
    command: "docker compose -p osaamisenhallinta-e2e up --build",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    /* Building the images and starting the backend can take several minutes. */
    timeout: 10 * 60 * 1000,
    gracefulShutdown: { signal: "SIGTERM", timeout: 30 * 1000 },
    env: {
      POSTGRES_DB: process.env.POSTGRES_DB ?? "e2e",
      POSTGRES_USER: process.env.POSTGRES_USER ?? "e2e",
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? "e2e",
    },
  },
});
