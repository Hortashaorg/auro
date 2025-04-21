import { expect, type Page, test } from "@playwright/test";

test("admin can create a new action and see it in the grid", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.goto(
    `http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin/actions`,
  );

  await page.getByRole("button", { name: "Create Action" }).click();

  await page.getByRole("textbox", { name: "Action Name" }).fill("Test Action");
  await page.getByRole("textbox", { name: "Description" }).fill(
    "Test action description",
  );

  await page.getByRole("img", { name: "Fishing 2" }).click();

  await page.getByLabel("Location").selectOption(
    "5bbcb026-e240-48d8-b66d-7105df74cf9f",
  );

  await page.getByRole("dialog").getByRole("button", { name: "Create Action" })
    .click();

  await expect(page.getByText("Test Action").first()).toBeVisible();
});

test("player is redirected from admin actions page", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto(
    `http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin/actions`,
  );
  await page.waitForURL("http://localhost:4000/servers");
  expect(page.url()).toBe("http://localhost:4000/servers");
});
