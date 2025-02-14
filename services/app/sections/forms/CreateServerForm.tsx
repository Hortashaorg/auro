import { Button } from "@kalena/components/inputs";
import { Input } from "@kalena/components/inputs";
import { Form } from "@kalena/components/inputs";
import { Text } from "@kalena/components/content";
import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["form"];

export const CreateServerForm = ({ ...props }: Props) => {
  return (
    <Form
      {...props}
      hx-post="/api/create-server"
      hx-target="#section-server-grid"
      hx-swap="outerHTML"
      id="section-create-server-form"
    >
      <div>
        <Text variant="paragraph" className="mb-2">Server Name</Text>
        <Input
          name="name"
          type="text"
          required
          minLength={3}
          maxLength={50}
          placeholder="Enter server name"
        />
      </div>

      <Button type="submit" variant="primary">
        Create Server
      </Button>
    </Form>
  );
};
