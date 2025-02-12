# Framework

A lightweight TypeScript framework for building server-side rendered
applications with built-in authentication, form validation, and type safety.

# Table of Contents

- [Framework](#framework)
  - [Dependencies](#dependencies)
  - [Features](#features)
- [Creating Routes](#creating-routes)
  - [Path](#path)
  - [Component](#component)
  - [Permission](#permission)
  - [Partial](#partial)
  - [Hmr](#hmr)
  - [Custom Context](#custom-context)
  - [Validation](#validation)
- [Application](#application)
  - [Auth Provider - Google](#auth-provider---google)
  - [Framework Variables](#framework-variables)
  - [Global Context](#global-context)
- [Error Handling](#error-handling)
  - [Validation Errors](#validation-errors)
  - [Custom Error Handling](#custom-error-handling)
  - [Permission Errors](#permission-errors)
  - [Global Error Pages](#global-error-pages)

## Dependencies

This framework is built on top of these excellent libraries:

- [Hono](https://hono.dev/) - Ultrafast web framework for the Edges
- [Valibot](https://valibot.dev/) - Type-safe schema validation library

We are grateful to the maintainers and contributors of these projects for their
amazing work.

## Features

- 🔒 Built-in auth code flow for authentication
- 🎯 Type-safe and Valibot for validation
- 🌍 Global and route-specific contexts
- 🔄 Automatic token refresh
- 🛡️ Authentication event hooks
- 🎨 Server-side rendering with JSX
- 🔥 Hot Module Reloading for development

# Creating Routes

Routes are created using `createRoute`:

This is the minimum required configuration of a route. If you find you repeat
the same configuration it is recommended to abstract route creation with a
function.

```ts
export const homeRoute = createRoute({
  path: "/",
  component: Home,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
});
```

## Path

The path is the URL path of the route.

## Component

The component is the JSX component that will be rendered.

## Permission

Check that returns a boolean value. If the value is `false` the user will be
redirected to the `redirectPath`. Function has access to
[Hono Context](https://hono.dev/api/context)

## Partial

If the route is partial, it will not be rendered in the main layout. This is
useful if you use something like HTMX.

## Hmr

If the route is set to use "Hot Module Replacement". This will help you refresh
the page when process restarts after a code change.

## Custom Context

If you need to pass data to the component that is not available in the context,
you can use the `customContext` function.

You can use the [Hono Context](https://hono.dev/api/context) in order to create
your own custom context.

```ts
export const homeRoute = createRoute({
  path: "/",
  component: Home,
  permission: {
    check: isPublic,
    redirectPath: "/",
  },
  partial: false,
  hmr: Deno.env.get("ENV") === "local",
  customContext: async (c) => {
    const account = await db.query.account.findFirst({
      where: (account, { eq }) => eq(account.email, c.var.email),
    });
    return { account };
  },
});
```

You can access your custom context like this:

```tsx
const Home = async () => {
  const yourCustomContext = await homeRoute.customContext();
  return (
    <div>
      {yourCustomContext.account.email}
    </div>
  );
};
```

## Validation

You can define different types of validation schemas for your routes. In order
to read how to validate data using valibot, please refer to the
[Valibot Documentation](https://valibot.dev).

```ts
const CreateServerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3)),
});

export const createServerRoute = createRoute({
  path: "/api/create-server",
  component: CreateServer,
  permission: {
    check: () => true,
    redirectPath: "/",
  },
  partial: true,
  hmr: Deno.env.get("ENV") === "local",
  formValidationSchema: CreateServerSchema,
});
```

This will return a [safeParse](https://valibot.dev/api/safeParse/) result from
[Valibot](https://valibot.dev), a modular and type safe schema library.

```ts
const CreateServer = () => {
  const validatedData = createServerRoute.context().req.valid("form");
  console.log(validatedData);
};
```

# Application

The application only requires to configure the authentication provider and the
pass the routes you have created.

```ts
app({
  authProvider: {
    name: "google",
    clientId: clientId,
    clientSecret: clientSecret,
    redirectPathAfterLogin: "/",
    redirectPathAfterLogout: "/",
    afterLoginHook: async (c) => {
      console.log("After a login attempt");
    },
    beforeLogoutHook: async (c) => {
      console.log("before user is about to be logged out");
    },
    refreshHook: async (c) => {
      console.log("when refresh of access token has occured");
    },
    validateHook: async (c) => {
      console.log("For every loggedIn request, before render");
    },
  },
  routes: [
    serversRoute,
    homeRoute,
    createServerRoute,
  ],
  port: 4000,
});
```

## Auth Provider - Google

If you use google as auth provider, you ned the following:

- Client ID
- Client Secret
- Authorized origins (e.g. `http://localhost:4000`)
- Authorized redirect URIs: origins + `/auth/login`

## Framework variables

With the abstraction we make sure to populate some useful variables in both the
route context and global context. That are both instances of
[Hono Context](https://hono.dev/api/context)

- `context.var.loginUrl`: Google OAuth login URL
- `context.var.logoutUrl`: Logout endpoint URL
- `context.var.isLoggedIn`: Authentication status
- `context.var.email`: User's email

## Global Context

You can access global context in any component. This is useful for components
that are used across different routes.

You can access the global context using the `getGlobalContext` function.

```tsx
export const Navbar = () => {
  const context = getGlobalContext();
  const loginUrl = context.var.loginUrl; // Can be used in a login button

  return (
    <Header>
      {context.var.isLoggedIn ? "is logged in" : "is not logged in"}
    </Header>
  );
};
```

# Error Handling

The framework provides several ways to handle errors in your application:

## Validation Errors

When using route validation schemas, validation errors are automatically handled
and can be accessed in your components:

```ts
const CreateServerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3)),
});

export const createServerRoute = createRoute({
  path: "/api/create-server",
  component: CreateServer,
  formValidationSchema: CreateServerSchema,
  // ... other config
});

const CreateServer = () => {
  const context = createServerRoute.context();
  const validationResult = context.req.valid("form");

  if (!validationResult.success) {
    // Access validation errors
    const errors = validationResult.issues;
    return <div>Error: {errors[0].message}</div>;
  }

  // Access validated data
  const data = validationResult.output;
  return <div>Success: {data.name}</div>;
};
```

## Custom Error Handling

For custom error scenarios, you can create error boundaries in your components:

```tsx
const ErrorBoundary = ({ children }: { children: JSX.Element }) => {
  try {
    return children;
  } catch (error) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }
};

// Usage in your component
const YourComponent = () => {
  return (
    <ErrorBoundary>
      <div>Your content here</div>
    </ErrorBoundary>
  );
};
```

## Permission Errors

Permission checks automatically handle unauthorized access by redirecting users:

```ts
export const adminRoute = createRoute({
  path: "/admin",
  component: AdminPanel,
  permission: {
    check: async (c) => {
      // Custom permission logic
      const isAdmin = await checkAdminStatus(c.var.email);
      return isAdmin;
    },
    redirectPath: "/unauthorized", // User is redirected here if check fails
  },
  // ... other config
});
```

## Global Error Pages

You can define custom error pages for common HTTP status codes:

```ts
app({
  // ... other config
  errorPages: {
    404: () => <NotFoundPage />,
    500: () => <ServerErrorPage />,
  },
});
```
