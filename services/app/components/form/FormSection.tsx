import { cn } from "@comp/utils/tailwind.ts";
import type { FC, JSX } from "@kalena/framework";
import { Text } from "@comp/typography/index.ts";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";

const formSectionVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "border-outline",
        subtle: "border-outline/50",
        none: "border-transparent",
      },
      spacingBottom: {
        sm: "mb-4 pb-4",
        md: "mb-8 pb-6",
        lg: "mb-12 pb-8",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      spacingBottom: "none",
    },
  },
);

type FormSectionProps =
  & JSX.IntrinsicElements["div"]
  & NonNullableProps<typeof formSectionVariants>
  & {
    title: string;
    description: string;
  };

/**
 * FormSection organizes form controls into logical sections with optional title and description
 *
 * @example
 * <FormSection
 *   title="Basic Information"
 *   description="Enter the general details about this item"
 *   variant="subtle"
 *   spacingBottom="lg"
 * >
 *   <FormControl inputName="name">
 *     <Label htmlFor="item-name">Name</Label>
 *     <Input id="item-name" name="name" />
 *   </FormControl>
 *
 *   <FormControl inputName="description">
 *     <Label htmlFor="item-description">Description</Label>
 *     <Textarea id="item-description" name="description" />
 *   </FormControl>
 * </FormSection>
 */
export const FormSection: FC<FormSectionProps> = ({
  className,
  children,
  title,
  description,
  variant,
  spacingBottom,
  ...props
}) => {
  return (
    <div
      className={cn(formSectionVariants({ variant, spacingBottom, className }))}
      {...props}
    >
      {title && (
        <Text as="h3" variant="h3" className="mb-2">
          {title}
        </Text>
      )}

      {description && (
        <Text variant="body" className="mb-4 text-on-surface">
          {description}
        </Text>
      )}

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
