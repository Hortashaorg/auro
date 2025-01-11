import type { JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {}
export const Button = ({ children, ...rest }: Props) => {
  return (
    <button
      {...rest}
      className="bg-primary-50 hover:bg-primary-100 text-text-700 font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
};
