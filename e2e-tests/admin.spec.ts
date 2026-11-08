import { test, expect } from "@playwright/test";

test("admin overview shows the admin center", async ({ page }) => {
  await page.goto("/admin/overview");

  await expect(page.getByText("Admin Center")).toBeVisible();
  for (const card of ["Certificates", "Skills", "Trainings", "Licenses"]) {
    await expect(page.getByText(`Total ${card}`)).toBeVisible();
  }

  await expect(
    page.getByRole("button", { name: "Add Qualification" }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Add Competence" }),
  ).toBeVisible();
});
