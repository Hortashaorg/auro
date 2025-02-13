import type { JSX } from "@package/framework";

type Props = JSX.IntrinsicElements["body"] & {
  title: string;
};
export const BaseLayout = ({
  title,
  children,
}: Props) => {
  return (
    <html lang="en" id="page">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <script
          type="module"
          src="https://cdn.jsdelivr.net/gh/starfederation/datastar@v1.0.0-beta.6/bundles/datastar.js"
        >
        </script>
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
