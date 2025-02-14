import { Button } from "@kalena/components/inputs";
import { Text } from "@kalena/components/content";
import { BaseLayout } from "@kalena/components/layouts";
import { createRoute, v } from "@kalena/framework";

const Design = () => {
  return (
    <BaseLayout title="Deno Hot Dude">
      <>
        <div x-data="themeData">
          <Text>
            Dark Light Theme
          </Text>
          <Button
            x-on:click="themeToggle"
            x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
          />
        </div>
        <div className="flex gap-2 flex-col">
          <Text>Buttons</Text>

          <div className="flex gap-2">
            <Button variant="primary" buttonSize="large">
              Primary
            </Button>
            <Button variant="secondary" buttonSize="large">
              Secondary
            </Button>
            <Button variant="outline" buttonSize="large">
              Outline
            </Button>
            <Button variant="danger" buttonSize="large">
              Danger
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="primary">
              Primary
            </Button>
            <Button variant="secondary">
              Secondary
            </Button>
            <Button variant="outline">
              Outline
            </Button>
            <Button variant="danger">
              Danger
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" buttonSize="small">
              Primary
            </Button>
            <Button variant="secondary" buttonSize="small">
              Secondary
            </Button>
            <Button variant="outline" buttonSize="small">
              Outline
            </Button>
            <Button variant="danger" buttonSize="small">
              Danger
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" disabled>
              Primary
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
            <Button variant="danger" disabled>
              Danger
            </Button>
          </div>
        </div>

        <div className="flex gap-2 flex-col">
          <Text>Text types</Text>
          <Text>Paragraph</Text>
          <Text variant="header">Title</Text>
          <Text>Paragraph</Text>
          <Text variant="error">Error</Text>
        </div>
      </>
    </BaseLayout>
  );
};

const DesignFormSchema = v.object({
  name: v.string(),
});

export const designRoute = createRoute({
  path: "/design",
  component: Design,
  permission: {
    check: () => true,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: DesignFormSchema,
  customContext: () => {
    return {
      name: "hello world",
    };
  },
});
