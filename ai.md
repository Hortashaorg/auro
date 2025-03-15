# AI Context Guide

## File Maintenance Guidelines

1. Structure
   - General concepts and architecture at the top
   - Specific patterns and examples towards bottom
   - Group related concepts together
   - Use clear hierarchical headings

2. Updates
   - When adding new information, consider its level of abstraction
   - Do not make changes in File Maintenance Guidelines
   - Place architectural decisions near the top
   - Place specific implementation patterns near bottom
   - Add dates to significant updates using format: `[YYYY-MM-DD]`

3. Quality Guidelines
   - Keep information factual and verifiable
   - Include file paths when referencing specific implementations
   - Use code blocks for concrete examples
   - Maintain clear separation between framework rules and project-specific
     patterns

4. LLM Optimization
   - Use consistent terminology
   - Keep sections atomic and well-labeled
   - Include relevant type definitions
   - Reference specific files and line numbers when possible

## Overview

Auro is a game server management platform built with TypeScript, HTMX, and a
modern component architecture.

## Architecture [2024-03-15]

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
   - Example: `services/app/components/display/table/Table.tsx`

3. Queries
   - Located in `services/app/queries/`
   - Encapsulate database operations and data fetching logic
   - Reusable across different components and routes
   - Example: `services/app/queries/userResources.ts`

### Data Flow Patterns

1. Query Separation
   - Database can be moved to dedicated query files. Especially if they are
     complicated and are likely to be reused.
   - Queries should be reusable and focused on a single responsibility

   ```typescript
   // Good
   import { getUserResources } from "@queries/userResources.ts";
   const resources = await getUserResources(serverId);

   // Avoid
   const resources = await db.select().from(schema.userResource)...
   ```

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

### HTMX Integration [2024-03-15]

1. Section IDs
   - Sections that may be updated via HTMX should have unique IDs
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
