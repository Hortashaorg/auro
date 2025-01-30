export const test = (): string => {
  return "Hello world!";
};

export const throwError = (message: string): never => {
  throw new Error(message);
};
