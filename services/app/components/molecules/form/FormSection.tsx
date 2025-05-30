import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";
import { Text, Title } from "@comp/atoms/typography/index.ts";

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

type FormSectionVariants = NonNullableProps<typeof formSectionVariants>;
type FormSectionProps = BaseComponentProps & FormSectionVariants & {
  title: string;
  description: string;
};

/**
 * FormSection organizes form controls into logical sections with optional title and description
 *
 * @props
 * - title: Section heading text
 * - description: Additional context or instructions for the section
 * - variant: Border style of the section ('default', 'subtle', 'none')
 * - spacingBottom: Bottom margin and padding ('sm', 'md', 'lg', 'none')
 * - children: Form controls to include in the section
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
}: FormSectionProps) => {
  return (
    <div
      className={cn(formSectionVariants({ variant, spacingBottom }), className)}
      {...props}
    >
      {title && (
        <Title level="h3">
          {title}
        </Title>
      )}

      {description && (
        <Text variant="body">
          {description}
        </Text>
      )}

      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};
