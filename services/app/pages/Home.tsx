import { BaseLayout } from "@layouts/BaseLayout.tsx";
import { Text } from "@comp/Text.tsx";

export const Home = () => {
  return (
    <BaseLayout title="Deno Hot Dude">
      <div>
        <Text variant="header">
          Hello my dude
        </Text>
      </div>
    </BaseLayout>
  );
};
