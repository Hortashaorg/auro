import { Text } from "@comp/Text.tsx";
import { Layout } from "@layouts/Layout.tsx";
import { getContext } from "@package/framework";

export const Home = () => {
  const context = getContext();

  console.log(context);

  return (
    <Layout title="Deno Hot Dude">
      <div>
        <Text variant="header">
          hello world
        </Text>
      </div>
    </Layout>
  );
};
