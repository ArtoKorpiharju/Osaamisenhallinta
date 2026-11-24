import { test, expect } from "@playwright/test";

test("supervisor overview shows stats and upcoming expirations", async ({
  page,
}) => {
  await page.goto("/supervisor/overview");

  await expect(
    page.getByRole("heading", { name: "Supervisor Overview" }),
  ).toBeVisible();
  for (const title of [
    "Invalid",
    "Expiring soon",
    "Require action",
    "Planned renewals",
  ]) {
    await expect(page.getByText(title, { exact: true }).first()).toBeVisible();
  }
  await expect(page.getByText("Emma Johnson")).toBeVisible();
});
