import { BaseLayout } from "@layouts/BaseLayout.tsx";
import { Text } from "@comp/Text.tsx";

export const Home = () => {
  return (
    <BaseLayout title="Deno Hot Dude">
      <>
        <h1>Hei Frank!</h1>
        <div x-data="themeData">
          <button
            x-on:click="themeToggle"
            x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
          >
          </button>
          <Text variant="header">
            Hello my dude
          </Text>
        </div>
      </>
    </BaseLayout>
  );
};
