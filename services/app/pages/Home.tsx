import { Layout } from "@layouts/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Info } from "@comp/feedback/Info.tsx";

export const Home = () => {
  return (
    <Layout title="Deno Hot Dude">
      <Text>Home page</Text>
      <Info variant="warning">
        <Text>This is a warning</Text>
      </Info>
    </Layout>
  );
};
