import { JSX } from "preact";

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
                <script src="https://unpkg.com/htmx.org@2.0.0"></script>
                <script src="//unpkg.com/alpinejs" defer></script>
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link
                    href={`/main.css`}
                    rel="stylesheet"
                />
                <title>{title}</title>
            </head>
            <body className="dark:bg-background-dark bg-background-light">
                <div className="container mx-auto p-4">
                    <div>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
};
