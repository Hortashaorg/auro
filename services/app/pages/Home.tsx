import { BaseLayout } from "../layouts/BaseLayout.tsx";

export const Home = () => {
  return (
    <BaseLayout title="Deno Hot Dude">
      <>
        <h1>Hei Øystein!</h1>
        <div x-data="themeData">
          <button
            x-on:click="themeToggle"
            x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
          >
          </button>
        </div>
      </>
    </BaseLayout>
  );
};
