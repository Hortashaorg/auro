# AI Context Guide

## Table of Contents

- [File Maintenance Guidelines](#file-maintenance-guidelines)
- [Overview](#overview)
- [Core Architecture](#core-architecture)
  - [Technology Stack](#technology-stack)
  - [Project Structure](#project-structure)
  - [Routing System](#routing-system)
  - [Authentication](#authentication)
- [UI Architecture](#ui-architecture)
  - [Component Organization](#component-organization)
  - [HTMX Integration](#htmx-integration)
  - [Alpine.js Patterns](#alpinejs-patterns)
- [Data Flow](#data-flow)
  - [Query Patterns](#query-patterns)

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
