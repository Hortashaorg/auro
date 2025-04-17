import { expect, type Page, test } from "@playwright/test";

test("admin can add a resource reward and a cost", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "admin");
  await page.goto(
    "http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin/actions/5bbcb026-e240-48d8-b66d-7105df74cf9f",
  );

  await page.getByRole("button", { name: "Add Reward" }).click();
  await page.getByRole("combobox").selectOption(
    "5bbcb026-e240-48d8-b66d-7105df74cf9f",
  );
  await page.getByRole("button", { name: "Add resource" }).click();
  await page.waitForTimeout(300);

  const newRow = page.locator("#modify-resource-reward-of-action-form td")
    .filter(
      { hasText: /^Test Resource$/ },
    );
  await expect(newRow)
    .toBeVisible();

  await page.getByRole("button", { name: "Costs" }).click();

  await page.getByRole("button", { name: "Add Cost" }).click();
  await page.getByRole("combobox").selectOption(
    "5bbcb026-e240-48d8-b66d-7105df74cf9f",
  );
  await page.getByRole("dialog").getByRole("button", { name: "Add Cost" })
    .click();
  await page.waitForTimeout(300);

  const newCostRow = page.locator("#modify-resource-cost-of-action-form td")
    .filter(
      { hasText: /^Test Resource$/ },
    );
  await expect(newCostRow)
    .toBeVisible();
});

test("player is redirected from action admin page", async ({ page }) => {
  const cwd = Deno.cwd();
  const { loginAs } = await import(
    `file:///${cwd}/playwright/login.ts`
  ) as {
    loginAs: (page: Page, user: "admin" | "player") => Promise<void>;
  };

  await loginAs(page, "player");
  await page.goto(
    "http://localhost:4000/servers/5bbcb026-e240-48d8-b66d-7105df74cf9f/admin/actions/5bbcb026-e240-48d8-b66d-7105df74cf9f",
  );
  await page.waitForURL("http://localhost:4000/servers");
  expect(page.url()).toBe("http://localhost:4000/servers");
});
