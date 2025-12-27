# Todo App

A simple todo application built with Vue 3, TypeScript, and Vite. This app allows users to create and manage multiple todo lists with individual todo items.

## Features

- 🔐 **Authentication** - Secure authentication using Clerk
- 📝 **Todo Lists** - Create and manage multiple todo lists
- ✅ **Todo Items** - Add, edit, complete, and delete todos
- 🎨 **Modern UI** - Clean, dark-themed interface
- 📱 **Responsive** - Works on desktop and mobile devices
- ⚡ **Fast** - Built with Vite for optimal performance

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- Yarn package manager
- A running instance of the CMS API (see `examples/cms-api`)
- Clerk account for authentication

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SERVICE_HOST=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BUILD_ID=your_build_id
```

### Environment Variables Explained

- `VITE_SERVICE_HOST` - The base URL of the CMS API backend
- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key for authentication
- `VITE_BUILD_ID` - Build identifier (can be any string)

## Project Setup

Install dependencies:

```sh
yarn
```

## Development

Start the development server with hot-reload:

```sh
yarn dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Building for Production

Build the application for production:

```sh
yarn build
```

The built files will be in the `dist` directory.

Preview the production build:

```sh
yarn preview
```

## Project Structure

```
src/
├── client/          # Auto-generated API client
├── lib/             # Utility functions (API setup)
├── router/          # Vue Router configuration
├── styles/          # Global styles and components
├── views/           # Vue components
│   ├── authenticated/  # Protected routes
│   │   ├── Dashboard.vue  # Main todo app interface
│   │   └── Layout.vue     # Authenticated layout
│   ├── Login.vue     # Login page
│   └── NotFound.vue  # 404 page
└── main.ts          # Application entry point
```

## Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Vite-SSG** - Static Site Generation
- **Vue Router** - Official router for Vue.js
- **Clerk** - Authentication and user management
- **SCSS** - CSS preprocessor

## API Integration

The app uses an auto-generated TypeScript client library located in `src/client/Api.ts`. This client is generated from the CMS API OpenAPI specification and provides type-safe API calls.

### API Endpoints Used

- `GET /todo-lists` - Get all todo lists (protected with `@Auth()`)
- `POST /todo-lists` - Create a new todo list (with audit context)
- `GET /todo-items?list_id={id}` - Get todos for a list (protected)
- `POST /todo-items` - Create a new todo item (with validation)
- `PUT /todo-items/{id}` - Update a todo item (with audit tracking)
- `DELETE /todo-items/{id}` - Delete a todo item (with audit trail)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).
