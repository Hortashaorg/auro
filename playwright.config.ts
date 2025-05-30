// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    screenshot: "only-on-failure",
  },
  workers: 1,
});
