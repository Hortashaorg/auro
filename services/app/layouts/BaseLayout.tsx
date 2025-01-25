import type { JSX } from "preact";

export const BaseLayout = (props: {
  title: string;
  children: JSX.Element;
}) => {
  const { title, children } = props;
  return (
    <html lang="en" id="page">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script src="//unpkg.com/alpinejs" defer></script>
        <link
          href={`/public/main.css`}
          rel="stylesheet"
        />
        <title>{title}</title>
      </head>
      <body className="dark:bg-background-950 bg-background-50">
        {children}
        <script src="/public/darkmode.js"></script>
      </body>
    </html>
  );
};
