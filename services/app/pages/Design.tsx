import { Button } from "@comp/Button.tsx";
import { Card } from "@comp/Card.tsx";
import { Text } from "@comp/Text.tsx";
import { BaseLayout } from "@layouts/BaseLayout.tsx";

export const Design = () => {
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

        <div className="flex gap-2">
          <Card>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
          </Card>
          <Card>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
          </Card>
          <Card>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
          </Card>
          <Card>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
            <Text>This is a card</Text>
          </Card>
        </div>
      </>
    </BaseLayout>
  );
};
