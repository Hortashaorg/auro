import { Text } from "@comp/Text.tsx";
import { Layout } from "@layouts/Layout.tsx";
import { getContext } from "@package/framework";

export const Home = () => {
  const context = getContext();

  return (
    <Layout title="Deno Hot Dude">
      <div>
        <Text variant="header">
          {context.req.url}
        </Text>
      </div>
    </Layout>
  );
};
