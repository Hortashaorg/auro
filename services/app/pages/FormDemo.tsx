import { Form } from "@comp/inputs/form/Form.tsx";
import { Button } from "@comp/inputs/Button.tsx";
import { Input } from "@comp/inputs/form/Input.tsx";
import { Textarea } from "@comp/inputs/form/Textarea.tsx";
import { Label } from "@comp/inputs/form/Label.tsx";
import { FormControl } from "@comp/inputs/form/FormControl.tsx";
import { FormRow } from "@comp/inputs/form/FormRow.tsx";
import { FormSection } from "@comp/inputs/form/FormSection.tsx";
import { RadioGroup } from "@comp/inputs/form/RadioGroup.tsx";
import { CheckboxGroup } from "@comp/inputs/form/CheckboxGroup.tsx";
import { Text } from "@comp/content/Text.tsx";
import { Layout } from "@comp/layout/Layout.tsx";
import { createRoute } from "@kalena/framework";
import { isPublic } from "@permissions/index.ts";

/**
 * Demo page for testing form components
 * This page can be deleted after testing
 */
const FormDemo = () => {
  return (
    <Layout title="Form Components Demo">
      <div className="container mx-auto py-8 px-4">
        <Text as="h1" variant="h1" className="mb-8">Form Components Demo</Text>

        <Form
          hx-post="/api/form-demo-submit"
          hx-swap="none"
        >
          <FormSection
            title="Basic Information"
            description="Test the FormRow component with different inputs"
            variant="default"
          >
            <FormRow gap="lg">
              <FormControl inputName="firstName">
                <Label htmlFor="first-name" required>First Name</Label>
                <Input
                  id="first-name"
                  name="firstName"
                  required
                  placeholder="Enter first name"
                />
              </FormControl>

              <FormControl inputName="lastName">
                <Label htmlFor="last-name" required>Last Name</Label>
                <Input
                  id="last-name"
                  name="lastName"
                  required
                  placeholder="Enter last name"
                />
              </FormControl>
            </FormRow>

            <FormControl inputName="email">
              <Label htmlFor="email" required>Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter email address"
              />
            </FormControl>

            <FormControl inputName="bio" hint="Tell us a bit about yourself">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Enter your bio"
              />
            </FormControl>
          </FormSection>

          <FormSection
            title="Preferences"
            description="Test RadioGroup and CheckboxGroup components"
            variant="subtle"
            spacingBottom="md"
          >
            <RadioGroup
              name="theme"
              label="Theme Preference"
              hint="Choose your preferred theme"
              options={[
                {
                  value: "light",
                  label: "Light",
                  description: "Light mode for daytime use",
                },
                {
                  value: "dark",
                  label: "Dark",
                  description: "Dark mode for nighttime use",
                },
                {
                  value: "system",
                  label: "System",
                  description: "Follow system settings",
                },
              ]}
              orientation="horizontal"
              required
              className="mb-6"
            />

            <CheckboxGroup
              name="notifications"
              label="Notification Preferences"
              hint="Select which notifications you want to receive"
              options={[
                {
                  value: "email",
                  label: "Email",
                  description: "Receive notifications via email",
                },
                {
                  value: "push",
                  label: "Push",
                  description: "Receive push notifications",
                },
                {
                  value: "sms",
                  label: "SMS",
                  description: "Receive text messages",
                },
              ]}
              orientation="vertical"
            />
          </FormSection>

          <div className="mt-8 flex justify-end">
            <Button type="submit" variant="primary">
              Submit Form
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export const formDemoRoute = createRoute({
  path: "/form-demo",
  component: FormDemo,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
