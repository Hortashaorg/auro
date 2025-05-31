# Project Auro

## Setup

### Doppler

https://docs.doppler.com/docs/cli

Environment variables are stored in Doppler. You must be invited to the auro
project to get access.

```bash
doppler login
```

## Development

This application uses Alpine.js for client-side state management and client side
reactivity. Application uses HTMX for server side reactivity.

### Alpine.js Integration

#### Page-Level State

Every page automatically has its own Alpine.js state scope through the Layout
component. This means you can use Alpine.js directives anywhere within a page
without additional wrappers.

#### Component-Level State

When you need isolated state for specific components, you can add additional
x-data scopes. This is useful for components that manage their own state:

```tsx
<div x-data="{ isOpen: false }">
  <button x-on:click="isOpen = !isOpen">Toggle</button>
  <div x-show="isOpen">Content</div>
</div>;
```

#### JSX Compatibility

Some Alpine.js directives use syntax that isn't compatible with JSX (like dots
in attribute names). In these cases, you can add the directives through props:

```tsx
const Modal = ({ modalRef, ...props }: Props) => {
  // Add Alpine.js window event listener through props
  props["x-on:close-dialog.window"] = `$refs.${modalRef}.close()`;
  return <dialog {...props}>{/* content */}</dialog>;
};
```

### Modal System

Modals in this application:

- Share state scope with their triggers through the page-level Alpine.js state
- Can be closed programmatically through window events

Example usage:

```tsx
<div x-data="{}">
  // You can use your own state instead of page level state
  <ModalButton modalRef="myModal">Open Modal</ModalButton>
  <Modal title="My Modal" modalRef="myModal">
    Modal content goes here
  </Modal>
</div>;
```
