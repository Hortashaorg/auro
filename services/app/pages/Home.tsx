import { Text } from "@comp/Text.tsx";
import { BaseLayout } from "@layouts/BaseLayout.tsx";

export const Home = () => {
  const random = Math.floor(Math.random() * 100);
  return (
    <BaseLayout title="Deno Hot Dude">
      <div>
        <Text variant="header">
          Hello my yo: {random}
        </Text>
      </div>
    </BaseLayout>
  );
};
