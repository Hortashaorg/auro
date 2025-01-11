import { Button } from "@comp/Button.tsx";
import { BaseLayout } from "@layouts/BaseLayout.tsx";

export const Design = () => {
  return (
    <BaseLayout title="Deno Hot Dude">
      <div x-data="themeData">
        <Button
          x-on:click="themeToggle"
          x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
        />
      </div>
    </BaseLayout>
  );
};
