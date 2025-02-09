# auro

## Setup

### Doppler

https://docs.doppler.com/docs/cli

Environment variables are stored in Doppler. You must be invited to the auro
project to get access.

```bash
doppler login
```

### Tailwind CLI

This project uses Deno as its runtime environment, and we aim to minimize
dependencies on Node.js and npm. While Tailwind CSS typically recommends using
`npx` to run their CLI tool, we've opted for a different approach to maintain
our Deno-centric architecture.

Instead, we use Tailwind's standalone CLI executable, which can be downloaded
and run directly without any Node.js dependencies. This approach:

- Maintains our commitment to using Deno
- Reduces complexity by avoiding mixed runtime environments
- Provides the same functionality as the npm-installed version

The CLI tool is installed in the `services/app` directory using these commands:

```bash
curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/latest/
download/tailwindcss-linux-x64
chmod +x tailwindcss-linux-x64
mv tailwindcss-linux-x64 tailwindcli
```

## Development

This application uses Alpine.js for client-side state management and client side
reactivity. Application uses HTMX for server side reactivity.

### Page-Level State

Every page automatically has its own Alpine.js state scope through the Layout
component. This means you can use Alpine.js directives anywhere within a page
without additional wrappers.
