import { Button } from "@comp/inputs/Button.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { Form } from "@comp/inputs/form/Form.tsx";
import { Text } from "@comp/content/Text.tsx";
import type { JSX } from "@kalena/framework";

type Props = JSX.IntrinsicElements["form"];

export const CreateLocationForm = ({ ...props }: Props) => {
  return (
    <Form
      {...props}
      hx-post="/api/create-location"
      hx-target="#location-section"
      hx-swap="none"
      id="section-create-location-form"
    >
      <div>
        <Text variant="body" className="mb-2">Server Name</Text>
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
