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
