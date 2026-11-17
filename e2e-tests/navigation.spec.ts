import { test, expect, type Page } from "@playwright/test";

// Helper function to switch role through the top bar
async function switchRole(page: Page, role: string) {
  await page
    .getByRole("button", { name: /(Employee|Supervisor|Admin)$/ })
    .click();
  await page.getByRole("menuitem", { name: "Switch role" }).click();
  await page.getByRole("menuitem", { name: role }).click();
}

test("account switching works", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/employee/overview");
  await expect(
    page.getByRole("heading", { name: "Employee Overview" }),
  ).toBeVisible();

  await switchRole(page, "Supervisor");
  await expect(
    page.getByRole("heading", { name: "Supervisor Overview" }),
  ).toBeVisible();

  await switchRole(page, "Admin");
  await expect(
    page.getByRole("heading", { name: "Admin Center" }),
  ).toBeVisible();
});

test("employee navigation opens each page", async ({ page }) => {
  await page.goto("/employee/overview");

  for (const [label, heading] of [
    ["Qualifications", "Employee Qualifications"],
    ["Competencies", "Employee Competencies"],
  ]) {
    await page.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(`/employee/${label.toLowerCase()}`);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test("admin navigation opens each page", async ({ page }) => {
  await page.goto("/admin/overview");

  for (const [label, heading] of [
    ["Qualifications", "Admin Qualifications"],
    ["Competencies", "Admin Competencies"],
  ]) {
    await page.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(`/admin/${label.toLowerCase()}`);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test("unknown route shows the not found page", async ({ page }) => {
  await page.goto("/does-not-exist");

  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});
