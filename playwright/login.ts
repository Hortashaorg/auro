import type { Page } from "@playwright/test";

export const loginAs = async (page: Page, user: "admin" | "player") => {
  await page.goto("http://localhost:4000/");
  await page.getByRole("link", { name: "Login" }).click();
  if (user === "admin") {
    await page.getByRole("textbox", { name: "Username" }).fill(
      Deno.env.get("TEST_USER_ADMIN") as string,
    );
    await page.getByRole("textbox", { name: "Password" }).fill(
      Deno.env.get("TEST_USER_PASSWORD") as string,
    );
  }
  if (user === "player") {
    await page.getByRole("textbox", { name: "Username" }).fill(
      Deno.env.get("TEST_USER_PLAYER") as string,
    );
    await page.getByRole("textbox", { name: "Password" }).fill(
      Deno.env.get("TEST_USER_PASSWORD") as string,
    );
  }
  await page.getByRole("button", { name: "Sign In" }).click();
};
