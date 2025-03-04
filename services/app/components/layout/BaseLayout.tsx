import type { FC, JSX } from "@kalena/framework";
type Props = JSX.IntrinsicElements["body"] & {
  title: string;
};
export const BaseLayout: FC<Props> = ({
  title,
  children,
}: Props) => {
  return (
    <html lang="en" id="page">
      <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <link
          href={`/public/main.css`}
          rel="stylesheet"
        />
        <title>{title}</title>
      </head>
      <body className="dark:bg-surface-dark bg-surface" x-data="{}">
        {children}
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"
        >
        </script>
        <script src="https://unpkg.com/lucide@latest"></script>
        <script>
          lucide.createIcons();
        </script>
        <script src="/public/darkmode.js"></script>
      </body>
    </html>
  );
};
