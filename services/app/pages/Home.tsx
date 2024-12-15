import { Text } from "@comp/Text.tsx";
import { BaseLayout } from "@layouts/BaseLayout.tsx";
import { getContext } from "@package/framework";

export const Home = () => {
  const context = getContext();

  return (
    <BaseLayout title="Deno Hot Dude">
      <div>
        <Text variant="header">
          {context.req.url}
        </Text>
      </div>
    </BaseLayout>
  );
};
