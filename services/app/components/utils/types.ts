import type { VariantProps } from "class-variance-authority";

type Optionalize<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type NonNullableProps<
  // deno-lint-ignore no-explicit-any
  Variants extends (...args: any) => any,
  T extends keyof VariantProps<Variants> = never,
> = Optionalize<
  {
    [Key in keyof VariantProps<Variants>]: NonNullable<
      VariantProps<Variants>[Key]
    >;
  },
  T
>;
