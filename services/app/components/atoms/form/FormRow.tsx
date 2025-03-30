import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import { cva } from "class-variance-authority";
import type { NonNullableProps } from "@comp/utils/types.ts";
import type { BaseComponentProps } from "@comp/utils/props.ts";

const formRowVariants = cva(
  "flex flex-col sm:flex-row w-full",
  {
    variants: {
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      },
    },
    defaultVariants: {
      gap: "md",
    },
  },
);

type FormRowVariants = NonNullableProps<typeof formRowVariants>;
type FormRowProps = BaseComponentProps & FormRowVariants;

/**
 * FormRow allows multiple form controls to be arranged horizontally
 *
 * @props
 * - gap: Spacing between form controls ('sm', 'md', 'lg')
 * - children: Form control components to be arranged
 *
 * @example
 * <FormRow>
 *   <FormControl inputName="firstName" className="flex-1">
 *     <Label htmlFor="first-name">First Name</Label>
 *     <Input id="first-name" name="firstName" />
 *   </FormControl>
 *
 *   <FormControl inputName="lastName" className="flex-1">
 *     <Label htmlFor="last-name">Last Name</Label>
 *     <Input id="last-name" name="lastName" />
 *   </FormControl>
 * </FormRow>
 */
export const FormRow: FC<FormRowProps> = ({
  className,
  children,
  gap,
  ...props
}) => {
  return (
    <div
      className={cn(formRowVariants({ gap, className }))}
      {...props}
    >
      {children}
    </div>
  );
};
