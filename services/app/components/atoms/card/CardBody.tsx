import { cn } from "@comp/utils/tailwind.ts";
import type { FC } from "@kalena/framework";
import type { BaseComponentProps } from "@comp/utils/props.ts";

type CardBodyProps = BaseComponentProps;

/**
 * CardBody component that provides consistent vertical spacing between card content
 *
 * @example
 * <Card>
 *   <CardBody>
 *     <Text>First item</Text>
 *     <Text>Second item</Text>
 *   </CardBody>
 * </Card>
 */
export const CardBody: FC<CardBodyProps> = ({
  children,
  className,
  ...props
}: CardBodyProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
