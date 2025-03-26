import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/typography/index.ts";
import { Alert } from "@comp/feedback/Alert.tsx";
import { createRoute } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";

const Home = () => {
  return (
    <Layout title="Home">
      <Text variant="h1" className="mb-8">Home page</Text>

      <Alert variant="warning" title="Warning! No game music">
        Do not expect any game music here. I suggest using spotify. Ok Li?
      </Alert>
    </Layout>
  );
};

export const homeRoute = createRoute({
  path: "/",
  component: Home,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
