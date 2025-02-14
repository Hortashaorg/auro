import { Layout } from "@layouts/Layout.tsx";
import { Text } from "@kalena/components/content";
import { Info } from "@kalena/components/feedback";
import { Tooltip } from "@kalena/components/overlay";
import { Button } from "@kalena/components/inputs";
import { Flex } from "@kalena/components/layouts";
import { Card } from "@kalena/components/layouts";
import { createRoute } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";

const Home = () => {
  return (
    <Layout title="Deno Hot Dude">
      <Text variant="header" className="mb-8">Home page</Text>

      <Info variant="warning" className="mb-8">
        <Text>This is a warning</Text>
      </Info>

      <Card className="mb-8">
        <Text variant="header" className="text-xl mb-4">Tooltip Examples</Text>
        <Flex gap={4} align="center" justify="center" className="p-4">
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
