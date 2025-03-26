# AI Context Guide

## Table of Contents

- [File Maintenance Guidelines](#file-maintenance-guidelines)
  - [Document Structure](#document-structure)
  - [Update Principles](#update-principles)
  - [Quality Standards](#quality-standards)
  - [AI-Optimization](#ai-optimization)
- [Overview](#overview)
- [Core Architecture](#core-architecture)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Routing System](#routing-system)
  - [Authentication](#authentication)
  - [TypeScript Patterns](#typescript-patterns)
  - [Query Architecture](#query-architecture)
- [UI Architecture](#ui-architecture)
  - [Component Organization](#component-organization)
  - [HTMX Integration](#htmx-integration)
  - [Alpine.js Patterns](#alpinejs-patterns)
- [Data Flow](#data-flow)
  - [Query Patterns](#query-patterns)
- [Implementation Patterns](#implementation-patterns)
  - [Component Data Dependencies](#component-data-dependencies)
  - [Empty State Patterns](#empty-state-patterns)
  - [HTMX Section ID Patterns](#htmx-section-id-patterns)
- [Import Patterns](#import-patterns)
- [API Endpoint Patterns](#api-endpoint-patterns)
- [Database Operation Patterns](#database-operation-patterns)
- [Error Handling Patterns](#error-handling-patterns)
- [Query Function Naming](#query-function-naming)

## File Maintenance Guidelines

### Document Structure

- **Hierarchical organization:** Start with high-level concepts, then drill down
  to specific implementations
- **Logical grouping:** Keep related concepts together (e.g., UI components,
  data access patterns)
- **Clear headings:** Use consistent heading levels to establish hierarchy (H2
  for major sections, H3 for subsections)
- **Progressive disclosure:** Place foundational concepts before specialized
  knowledge

### Update Principles

- **Contextual placement:** Add new information at the appropriate level of
  abstraction
- **Preserve guidance sections:** Avoid changing these File Maintenance
  Guidelines
- **Architecture focus:** Place architectural decisions near the top of the
  document
- **Implementation details:** Place specific implementation patterns lower in
  the document

### Quality Standards

- **Factual accuracy:** Ensure all information accurately reflects the current
  codebase
- **Specific references:** Include file paths when referencing implementations
  (e.g., `services/app/components/Button.tsx`)
- **Code examples:** Use concrete, runnable examples in appropriate
  language-tagged code blocks
- **Pattern separation:** Clearly distinguish between framework patterns and
  project-specific implementations
- **Consistency checks:** Periodically review to ensure guidance aligns with
  actual code practices

### AI-Optimization

- **Consistent terminology:** Use the same terms throughout (e.g., don't
  alternate between "page" and "view")
- **Atomicity:** Keep sections focused on a single concept with clear boundaries
- **Clear labeling:** Use descriptive headings that convey the content's purpose
- **Type information:** Include relevant TypeScript interfaces and types when
  describing data structures
- **Specific references:** Mention file names and line numbers for important
  implementations
- **Context hints:** Provide relationship information between components,
  showing how they interact

## Overview

Auro is a game server management platform built with TypeScript, HTMX, Alpine.js
and Hono. It uses Deno as the runtime environment and it tries to use few
dependencies.

## Core Architecture

### Technology Stack

1. Runtime & Framework
   - Deno for runtime environment
   - Hono for server-side framework
   - Type-safe validation with Valibot
   - Server-side rendering with JSX

2. UI Layer
   - HTMX for server-driven interactivity
   - Alpine.js for client-side state management
   - Tailwind CSS for styling
   - Progressive enhancement approach

3. Data & State Management
   - PostgreSQL database with Drizzle ORM
   - Type-safe query building
   - Context-based state passing
   - Separation of queries from components

4. Observability
   - OpenTelemetry integration for tracing
   - Performance monitoring via spans
   - Error tracking with structured logs
   - Tracing used throughout route handling

### Project Structure

1. Monorepo Organization
   - `/packages/framework` - Core framework code
   - `/packages/database` - Database schemas and migrations
   - `/packages/common` - Shared utilities
   - `/services/app` - Main application

2. Application Layout
   - `/pages` - Full page routes
   - `/api` - HTMX endpoints (partial routes)
   - `/components` - Reusable UI elements
   - `/sections` - Larger UI compositions
   - `/queries` - Database access layer
   - `/permissions` - Authentication checks

### Routing System

1. Route Definition
   - Routes created with `createRoute` from framework
   - Pages vs. API endpoints (partial routes)
   - Built-in permission checking
   - Type-safe form validation

   ```typescript
   export const resourcesRoute = createRoute({
     path: "/servers/:serverId/resources",
     component: ResourcesPage,
     permission: {
       check: isAuthenticated,
       redirectPath: "/",
     },
     partial: false,
     hmr: Deno.env.get("ENV") === "local",
     paramValidationSchema: serverParamSchema,
   });
   ```

2. Route Organization
   - Routes organized by feature in `/pages` and `/api`
   - All routes registered in `services/app/main.ts`
   - Routes follow URL structure in filepath
   - Partial routes for HTMX endpoints

### Authentication

1. Provider Architecture
   - Currently supports Google OAuth
   - Authentication hook system for extensibility
   - Token refresh and validation built-in

2. Implementation Patterns
   - Auth providers configured in `services/app/main.ts`
   - Protected routes use permission checks
   - Token management handled by framework
   - Custom hooks for post-authentication actions

   ```typescript
   // Auth configuration example
   const myApp = app({
     authProvider: {
       name: "google",
       clientId,
       clientSecret,
       redirectPathAfterLogin: "/",
       redirectPathAfterLogout: "/",
       afterLoginHook,
       beforeLogoutHook,
       refreshHook,
     },
     // ... other configuration
   });
   ```

### TypeScript Patterns

TypeScript helps catch errors early and provides better developer experience.
These patterns are fundamental to our architecture.

1. Data Safety
   - Use non-null assertions only when data is guaranteed to exist
   - Handle undefined/null cases explicitly through type narrowing
   - Prefer early returns with type guards
   - Example:
   ```typescript
   // Good
   const data = await getData();
   if (!data) {
     return <EmptyState />;
   }
   // TypeScript now knows data is non-null
   return <Content data={data} />;

   // Avoid
   const data = await getData();
   return <Content data={data!} />; // Using non-null assertion
   ```

### Query Architecture

1. Type Definition Pattern
   - Export types for query results to ensure type safety
   - Document the shape of returned data
   - Handle nullable fields explicitly in the type definition
   - Example:
   ```typescript
   export type ResourceLeaderboardEntry = {
     user: {
       id: string;
       name: string;
     };
     resource: {
       id: string;
       name: string;
     };
     user_resource: {
       quantity: number;
     };
     asset: {
       url: string;
     };
   };

   // Function should specify return type
   export async function getResourceLeaderboard(
     resourceId: string,
   ): Promise<ResourceLeaderboardEntry[]> {
     // ...
   }
   ```

2. Framework Query Patterns
   - Queries should be reusable and focused on a single responsibility
   - Use dedicated query files for complex or reusable queries
   - Implement proper error handling and tracing
   - Follow type-safe query building practices

### Authentication

1. Provider Architecture
   - Currently supports Google OAuth
   - Authentication hook system for extensibility
   - Token refresh and validation built-in

2. Implementation Patterns
   - Auth providers configured in `services/app/main.ts`
   - Protected routes use permission checks
   - Token management handled by framework
   - Custom hooks for post-authentication actions

   ```typescript
   // Auth configuration example
   const myApp = app({
     authProvider: {
       name: "google",
       clientId,
       clientSecret,
       redirectPathAfterLogin: "/",
       redirectPathAfterLogout: "/",
       afterLoginHook,
       beforeLogoutHook,
       refreshHook,
     },
     // ... other configuration
   });
   ```

## UI Architecture

### Component Organization

1. Sections
   - Located in `services/app/sections/`
   - Represent larger, composable parts of the UI
   - Often correspond to specific routes or major UI regions
   - Can be targeted by HTMX for partial updates
   - Example: `services/app/sections/views/ResourcesTable.tsx`

2. Components
   - Located in `services/app/components/`
   - Reusable UI elements with specific styling and behavior
   - Organized by category (display, inputs, layout, etc.)
   - Can receive events from HTMX that trigger behavior
   - Example: `services/app/components/display/table/Table.tsx`

3. Component Hierarchy
   - Core UI primitives (Button, Input, etc.)
   - Compound components (Cards, Menus, etc.)
   - Layouts (containers, grids, etc.)
   - Sections (feature-specific larger components)
   - Pages (full page compositions)

4. Documentation Pattern
   - Components should include JSDoc with:
     - Description of purpose
     - Feature list
     - Usage examples
     - Props documentation

   ```typescript
   /**
    * Tooltip component for displaying additional information on hover
    *
    * Features:
    * - Multiple variants (dark, light)
    * - Positioning options (top, bottom, left, right)
    * - Smooth transition animations
    * - Alpine.js integration for show/hide behavior
    * - Accessible with proper ARIA role
    *
    * @example
    * <Tooltip content="This is helpful" position="top">
    *   <Button>Hover Me</Button>
    * </Tooltip>
    */
   ```

### HTMX Integration

1. Section IDs
   - Sections intended for HTMX updates should have unique IDs
   - IDs should be descriptive and follow a consistent pattern
   ```typescript
   <Section id="player-resources">
   ```

2. HTMX Attributes
   - Use `hx-post` for server actions
   - Use `hx-swap` to control update behavior
   - Target specific sections using their IDs
   ```typescript
   <Button
     hx-post="/api/servers/${id}/actions/${actionId}/execute"
     hx-swap="none"
   >
   ```

3. Form Handling
   - Use form validation schemas for type-safe validation
   - Handle validation errors with `form-error` events
   - Trigger updates through HTMX instead of traditional form submission
   - Use partial routes for form processing endpoints

### Alpine.js Patterns

1. State Scoping
   - Page-level state through Layout component
   - Component-level state with x-data
   - Nested state for complex components

   ```typescript
   // Page-level state (from Layout)
   <div x-data="{activeTab: 'resources'}">
     {/* Component-level state */}
     <div x-data="{isOpen: false}">
       <button x-on:click="isOpen = !isOpen">Toggle</button>
       <div x-show="isOpen">Content</div>
     </div>
   </div>;
   ```

2. Event Handling
   - Use x-on for event binding
   - Combine with HTMX for server interactions
   - Keep client-side logic minimal
   - The component library should be written in order to handle events from the
     server.

   ```typescript
   <button
     x-on:click="activeTab = 'resources'"
     hx-get="/api/servers/${id}/resources"
     hx-target="#content"
   >
     Resources
   </button>;
   ```

3. Reactivity Best Practices
   - Use computed values for derived state
   - Keep Alpine.js state serializable
   - Prefer server-driven state for complex data
   - Use x-effect for side effects

## Data Flow

### Query Patterns

1. Query Separation
   - Database can be moved to dedicated query files. Especially if they are
     complicated and are likely to be reused.
   - Queries should be reusable and focused on a single responsibility.

2. Component Data Loading
   - Components can be async to load their own data
   - Data fetching should be done at the appropriate component level
   - Props should be minimal and focused on configuration
   ```typescript
   export const ResourcesTable = async ({ serverId }: Props) => {
     const resources = await getUserResources(serverId);
     return <Table>...</Table>;
   };
   ```

3. Error Handling
   - Validation errors should be captured and returned to UI
   - Database errors should be logged with tracing
   - Use structured error responses for API endpoints
   - Handle authentication errors consistently across routes

## Implementation Patterns

These patterns represent project-specific implementations and best practices
that emerged from real development experience.

### Component Data Dependencies

Components should be self-contained units that manage their own data fetching
and state handling. This ensures components are reusable and maintainable.

1. Data Fetching Pattern
   - Components should fetch all required data independently
   - Use separate queries for different data needs (e.g., resource info vs
     leaderboard data)
   - Handle empty/loading states explicitly
   - Example pattern:
   ```typescript
   export const MyComponent = async ({ id }: Props) => {
     const [mainData, relatedData] = await Promise.all([
       getMainData(id),
       getRelatedData(id),
     ]);

     if (!mainData) {
       return <EmptyState message="No data available" />;
     }

     return <ComponentContent data={mainData} related={relatedData} />;
   };
   ```

### Empty State Patterns

Empty states are crucial for good UX. They should be informative and guide users
on what to do next.

1. Component Empty States
   - Every component should handle its empty state explicitly
   - Empty states should be informative and actionable
   - Use consistent empty state messaging across the application
   - Consider the context when showing empty states (e.g., "Be the first!" vs
     "No data available")

2. Loading States
   - Components should handle loading states gracefully
   - Consider using skeleton loaders for better UX
   - Loading states should prevent layout shifts

### HTMX Section ID Patterns

Section IDs are crucial for HTMX to target the correct elements for updates.
Follow these patterns for consistent and maintainable IDs.

1. ID Structure
   - IDs should follow the pattern: `${feature}-${subfeature}-${identifier}`
   - For lists/tables, include the item ID: `resource-leaderboard-${resourceId}`
   - Ensure IDs are unique across the page when multiple instances exist
   ```typescript
   // Good
   <Section id={`resource-leaderboard-${resourceId}`}>

   // Avoid
   <Section id="leaderboard">
   ```

These patterns emerged from real implementation experience and help maintain
consistency and type safety across the codebase. They should be followed when
implementing new features or modifying existing ones.

## Import Patterns

1. Aliased Imports
   - Use aliased imports instead of relative imports
   - Common aliases:
     - `@comp` - for components (`@comp/inputs/form/Form.tsx`)
     - `@sections` - for sections (`@sections/profile/ProfileForm.tsx`)
     - `@pages` - for pages (`@pages/Home.tsx`)
     - `@api` - for API endpoints (`@api/CreateServer.tsx`)
     - `@permissions` - for permissions (`@permissions/index.ts`)
     - `@queries` - for database queries (`@queries/servers.ts`)
   - Example:
   ```typescript
   // Do this
   import { Button } from "@comp/inputs/Button.tsx";
   import { isLoggedIn } from "@permissions/index.ts";

   // Not this
   import { Button } from "../../components/inputs/Button.tsx";
   import { isLoggedIn } from "../permissions/index.ts";
   ```

2. Package Imports
   - For framework and shared packages, use direct imports
   - Common packages:
     - `@kalena/framework` - for core framework utilities
     - `@package/database` - for database utilities and schema
     - `@package/common` - for shared utilities
   - All database utilities should be imported from `@package/database`
     including:
     - `schema`, `db`, `eq`, `and`, `sql` etc.
   - Example:
   ```typescript
   // Do this
   import { and, db, eq, schema, sql } from "@package/database";

   // Not this
   import { db, schema } from "@package/database";
   import { and, eq, sql } from "drizzle-orm";
   ```

## API Endpoint Patterns

1. Form Validation
   - Use Valibot (`v`) for form validation schemas
   - Define validation schema at the bottom of the file
   - Reference it in the route definition using `formValidationSchema`
   - Example:
   ```typescript
   // Form validation schema
   const UpdateAccountNicknameSchema = v.object({
     nickname: v.pipe(v.string(), v.minLength(3), v.maxLength(50)),
   });

   // Route definition
   export const updateAccountNicknameRoute = createRoute({
     path: "/api/account/update-nickname",
     component: UpdateAccountNickname,
     permission: {
       check: isLoggedIn,
       redirectPath: "/",
     },
     partial: true,
     hmr: Deno.env.get("ENV") === "local",
     formValidationSchema: UpdateAccountNicknameSchema,
   });
   ```

2. HTMX Error Handling
   - Access form validation result with `context.req.valid("form")`
   - Handle validation errors with form-error events
   - Set success responses with appropriate HX-Trigger events
   - Example error handling:
   ```typescript
   if (!result.success) {
     const errorEvents: Record<string, string> = {};

     for (const issue of result.issues) {
       const field: string = issue.path?.[0]?.key as string ??
         throwError("Invalid issue path");
       errorEvents[field] = issue.message;
     }

     context.header(
       "HX-Trigger",
       createEvents([
         {
           name: "form-error",
           values: errorEvents,
         },
       ]),
     );

     return <p>Failure</p>;
   }
   ```

3. Event Triggers
   - Use consistent event names across the application
   - Common events:
     - `form-error` - For form validation errors
     - `clear-form` - To reset form inputs
     - `toast` - To display notifications
   - Example success response:
   ```typescript
   context.header(
     "HX-Trigger",
     createEvents([
       { name: "clear-form", values: { value: true } },
       {
         name: "toast",
         values: { type: "success", message: "Updated successfully" },
       },
     ]),
   );
   ```

4. Component Updates
   - Use `hx-swap-oob` to update components outside the normal flow
   - Provide unique identifiers for components to be updated
   - Example:
   ```tsx
   return <ProfileForm account={updatedAccount} hx-swap-oob="true" />;
   ```

## Database Operation Patterns

1. Query Typing
   - Type your query results explicitly to ensure type safety
   - Use proper typing for database operations
   - Example:
   ```typescript
   // Define explicit types for query results
   type AccountWithServers = {
     account: {
       id: string;
       email: string;
       nickname: string | null;
     };
     servers: Array<{
       id: string;
       name: string;
     }>;
   };

   // Type the return value of your query function
   export async function getAccountWithServers(
     email: string,
   ): Promise<AccountWithServers | null> {
     // Query implementation
   }
   ```

2. Database Operation Best Practices
   - Use `eq`, `and`, `or` from the database package for conditions
   - Never use string interpolation for SQL values (avoids SQL injection)
   - Use `sql` template literal for raw SQL when necessary
   - Handle nullable results properly with explicit checks
   - Example:
   ```typescript
   // Good pattern
   const [user] = await db.select({
     id: schema.user.id,
     name: schema.user.name,
   })
     .from(schema.user)
     .where(
       and(
         eq(schema.user.accountId, accountId),
         eq(schema.user.serverId, serverId),
       ),
     );

   if (!user) {
     return null; // or throw an error if appropriate
   }

   return user;
   ```

3. Date/Time Handling
   - Use `sql` template for date operations
   - For updates, prefer `sql\`now()\`` over JavaScript Date objects
   - Example:
   ```typescript
   // Good
   await db.update(schema.user)
     .set({
       name: newName,
       updatedAt: sql`now()`,
     })
     .where(eq(schema.user.id, userId));

   // Avoid
   await db.update(schema.user)
     .set({
       name: newName,
       updatedAt: new Date(), // This can cause type errors
     })
     .where(eq(schema.user.id, userId));
   ```

## Error Handling Patterns

1. Permission-Protected Routes
   - For routes with permission checks, assume authentication data exists
   - Use `throwError` for missing data that should exist due to permissions
   - Example:
   ```typescript
   // Good - Use throwError for missing data that should exist
   const email = context.var.email ??
     throwError("Email not found despite user being logged in");

   // Avoid - Don't return UI elements for system errors
   if (!email) {
     return <div>Not logged in</div>; // Bad practice
   }
   ```

2. Data Validation Levels
   - **System Errors**: Use `throwError` when data should exist based on
     architecture
   - **User Errors**: Handle gracefully with proper UI feedback
   - **Optional Data**: Use nullish coalescing for fallbacks
   - Example:
   ```typescript
   // System error - should never happen in normal flow
   const account = await db.query.account.findFirst({
     where: (account, { eq }) => eq(account.email, email),
   }) ?? throwError("Account not found for logged-in user");

   // User error - handle gracefully
   if (userInput.length < 3) {
     return <ValidationError message="Input must be at least 3 characters" />;
   }

   // Optional data - provide fallback
   const displayName = user.nickname || "Anonymous";
   ```

3. Error Propagation
   - Let system errors bubble up to the global error handler
   - Include context in error messages for easier debugging
   - Avoid swallowing errors with empty catch blocks
   - Example:
   ```typescript
   try {
     const result = await riskyOperation();
     return result;
   } catch (error) {
     // Bad - swallowing error
     console.error(error);
     return null;

     // Good - add context and rethrow
     throw new Error(`Failed in riskyOperation: ${error.message}`);
   }
   ```

4. Using Functions That Return or Throw
   - Some utility functions will throw errors rather than return null
   - Understand which pattern is used by each function
   - Example functions:
     - `getUserByEmail` - throws if user not found
     - `currentUser` - throws if user not found
     - `db.query.account.findFirst` - returns null if not found

## Query Function Naming

1. Clear and Specific Names
   - Function names should clearly describe what they fetch and return
   - Include both input and output information in the name when possible
   - Examples:
     - `getUserByEmail` → `getUserForServer` (when it requires both email and
       serverId)
     - `getServerById` → `getServerWithActions` (when it returns server with its
       actions)

2. Common Naming Patterns
   - `get[Entity]` - Get a single entity by its primary key
   - `get[Entity]By[Property]` - Get a single entity by a property
   - `get[Entity]With[RelatedEntities]` - Get an entity with its related
     entities
   - `list[Entities]` - Get a list of entities
   - `list[Entities]By[Property]` - Get a list of entities filtered by a
     property

3. Documentation
   - Always document query functions with JSDoc
   - Include:
     - What the function fetches
     - Required parameters
     - Return type
     - Whether it throws errors or returns null for missing data
   - Example:
   ```typescript
   /**
    * Get account and all associated users across servers
    *
    * @param email The email address of the account to fetch
    * @returns The account and all server users associated with it
    * @throws Error if account not found
    */
   export const getAccountWithUsers = async (email: string) => {
     // Implementation
   };
   ```
