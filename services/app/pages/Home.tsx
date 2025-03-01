import { Layout } from "@sections/layout/Layout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Info } from "@comp/feedback/Info.tsx";
import { Tooltip } from "@comp/overlay/Tooltip.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Flex } from "@comp/layout/Flex.tsx";
import { Card } from "@comp/layout/Card.tsx";
import { createRoute } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";

const Home = () => {
  return (
    <Layout title="Home">
      <Text variant="h1" className="mb-8">Home page</Text>

      <Info variant="warning" className="mb-8">
        <Text>This is a warning</Text>
      </Info>

      <Card className="mb-8">
        <Text variant="body" className="text-xl mb-4">Tooltip Examples</Text>
        <Flex gap="md" align="center" justify="center" className="p-4">
          <Tooltip content="Default top tooltip" position="top">
            <Button>Hover Me (Top)</Button>
          </Tooltip>

          <Tooltip
            content="Bottom light variant"
            position="bottom"
            variant="light"
          >
            <Button variant="secondary">Hover Me (Bottom)</Button>
          </Tooltip>

          <Tooltip content="Left position tooltip" position="left">
            <Button variant="outline">Hover Me (Left)</Button>
          </Tooltip>

          <Tooltip content="Right position tooltip" position="right">
            <Button variant="danger">Hover Me (Right)</Button>
          </Tooltip>
        </Flex>
      </Card>
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
