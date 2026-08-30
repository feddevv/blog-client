# Blog Client

A modern, responsive blog client web application built with React 19, TypeScript, Vite, and Tailwind CSS. It connects to a [RESTful blog API](https://github.com/feddevv/blog-api) to provide user authentication, post browsing with search and pagination, markdown post rendering, interactive comments, post/comment likes, and dark/light theme switching.

---

## Tech Stack

- **Core & Build Tooling**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/)
- **Routing**: [React Router](https://reactrouter.com/) (v8)
- **Data Fetching & State Management**: [TanStack Query v5](https://tanstack.com/query) (`@tanstack/react-query`), [TanStack Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools), [Axios](https://axios-http.com/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [`@hookform/resolvers`](https://github.com/react-hook-form/resolvers)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography), [React Icons](https://react-icons.github.io/react-icons/), [Sonner](https://sonner.emilkowal.ski/) (toasts), [`class-variance-authority`](https://cva.style/), [`clsx`](https://github.com/lukeed/clsx), [`tailwind-merge`](https://github.com/dcastil/tailwind-merge)
- **Content Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown), [Remark GFM](https://github.com/remarkjs/remark-gfm)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [JSDOM](https://github.com/jsdom/jsdom), [MSW (Mock Service Worker)](https://mswjs.io/)
- **Code Quality**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [`typescript-eslint`](https://typescript-eslint.io/), [`@tanstack/eslint-plugin-query`](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query)

---

## Requirements

Before getting started, make sure you have the following installed:

- **Node.js**: `v18.0.0` or higher (Node `v20+` recommended)
- **Package Manager**: `npm` (v9+), `pnpm`, or `yarn`

---

## Quick Start

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd blog-client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal).

---

## Main Scripts

| Script          | Command           | Description                                                                      |
| :-------------- | :---------------- | :------------------------------------------------------------------------------- |
| **Development** | `npm run dev`     | Starts the Vite development server with Hot Module Replacement (HMR).            |
| **Build**       | `npm run build`   | Runs TypeScript type checking (`tsc -b`) and builds production-ready bundles.    |
| **Preview**     | `npm run preview` | Locally serves the production build from the `dist/` directory.                  |
| **Lint**        | `npm run lint`    | Runs ESLint across the codebase to check for code quality and style issues.      |
| **Test**        | `npm run test`    | Runs the unit and integration test suite using Vitest and React Testing Library. |

---

## Documentation

For in-depth guides and architectural details, refer to the project documentation:

- [Architecture](docs/architecture.md)
