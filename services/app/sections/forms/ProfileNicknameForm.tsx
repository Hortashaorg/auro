import type { JSX } from "@kalena/framework";
import {
  Form,
  FormButton,
  FormControl,
  Input,
  Label,
} from "@comp/form/index.ts";
import { Text } from "@comp/typography/index.ts";

type Props = JSX.IntrinsicElements["div"] & {
  account: {
    id: string;
    email: string;
    nickname: string | null;
  };
};

export const ProfileNicknameForm = ({
  account,
  ...props
}: Props) => {
  return (
    <div {...props}>
      <Form
        id="nickname-form"
        className="space-y-4"
        hx-post="/api/account/update-nickname"
        hx-swap="none"
        x-data="{ errors: {} }"
      >
        <div>
          <FormControl inputName="nickname" className="mb-2">
            <Label htmlFor="nickname" required>Name</Label>
            <Input
              id="nickname"
              name="nickname"
              placeholder="Your name"
              value={account.nickname || ""}
              required
              minLength={3}
              maxLength={50}
              className="w-full"
            />
          </FormControl>
          <Text
            variant="body"
            className="text-gray-500 dark:text-gray-400 text-sm"
          >
            This will be your default display name across all servers.
          </Text>
        </div>

        <div>
          <FormButton
            type="submit"
            formId="nickname-form"
            variant="primary"
          >
            Update Default Name
          </FormButton>
        </div>
      </Form>
    </div>
  );
};
