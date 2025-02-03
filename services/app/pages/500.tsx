import { getContext } from "@context/index.ts";

export const Error = () => {
  const context = getContext();
  return (
    <html lang="en">
      <head>
        <title>Deno Hot Dude</title>
      </head>
      <body>
        <h1>500 - Something went wrong</h1>
        {context.honoContext.error
          ? <p>{context.honoContext.error.message}</p>
          : <p>Unknown error</p>}
      </body>
    </html>
  );
};
