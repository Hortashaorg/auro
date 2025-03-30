import { Form, Input, Label } from "@comp/atoms/form/index.ts";
import { FormControl } from "@comp/molecules/form/index.ts";
import { Button } from "@comp/atoms/buttons/index.ts";

export const CreateServerForm = () => {
  return (
    <Form
      hx-post="/api/create-server"
      hx-swap="none"
    >
      <div className="space-y-4">
        <FormControl
          inputName="name"
          hint="Choose a unique name for your server"
        >
          <Label htmlFor="server-name" required>Server Name</Label>
          <Input
            id="server-name"
            name="name"
            type="text"
            required
            minLength={3}
            maxLength={50}
            placeholder="Enter server name"
          />
        </FormControl>

        <Button type="submit" variant="primary" className="mt-4">
          Create Server
        </Button>
      </div>
    </Form>
  );
};
