import { test, expect } from "@playwright/test";

test("employee overview shows qualifications and required actions", async ({
  page,
}) => {
  await page.goto("/employee/overview");

  await expect(page.getByText("My Qualifications")).toBeVisible();
  await expect(page.getByText("Logistics Coordinator")).toBeVisible();
  await expect(page.getByText("Warehouse Operator")).toBeVisible();
  await expect(page.getByText("Maintenance Technician")).toBeVisible();
  await expect(page.getByText("First Aid Responder")).toBeVisible();
});
