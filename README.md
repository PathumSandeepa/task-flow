<div align="center">
  <h1>✓ Task Flow</h1>
  <p><strong>A Modern, Multi-Tenant Task Management Dashboard</strong></p>
  <p>Built with NestJS, React 19, Vite, Tailwind CSS v4, and shadcn/ui</p>
</div>

---

## 📖 Overview

Task Flow is a full-stack, multi-user task management application built from the ground up for **scale, developer experience, and code quality**. It features a robust NestJS API backend and a highly polished React + Vite frontend, heavily utilizing modern, glassmorphic UI patterns.

This repository serves as a blueprint for a production-ready **Domain-Driven Design (DDD)** architecture in a `pnpm` monorepo.

---

## 🏗️ Architecture (Domain-Driven Design)

Task Flow embraces **Domain-Driven Design (DDD)** principles across both the Backend (BE) and Frontend (FE). This architectural choice ensures the codebase remains modular, highly testable, and strictly decoupled.

### 🛡️ Backend (`apps/api`)
The NestJS backend is structurally organized into distinct domains with strictly enforced boundaries:
- **Authentication Domain (`src/auth`)**: Encapsulates all identity logic. It handles secure user registration, stateless JWT issuance, and payload validation (`jwt.strategy.ts`), ensuring business logic never intertwines with security concerns.
- **Task Domain (`src/tasks`)**: Manages isolated, multi-tenant task data structures. Controllers are intentionally kept lean, acting only as HTTP routers that immediately delegate execution to the `TasksService`.
- **Zero-`any` Strictness**: Controllers securely extract strongly-typed `JwtPayload` objects from intercepted requests, ensuring complete end-to-end type safety. 

### 🖥️ Frontend (`apps/web`)
The React frontend uses a tiered architecture to cleanly separate UI presentation, global state, and API integration:
- **Presentation Layer**: Dumb components (`TaskItem.tsx`, `AddTaskForm.tsx`) handle purely visual states and `shadcn/ui` rendering, while smart pages (`DashboardPage.tsx`) orchestrate layout structure.
- **State Layer (`useStore.ts`)**: Powered by **Zustand** and **Immer**. Complex, deeply nested state mutations are handled immutably. Client sessions are automatically persisted to `localStorage`.
- **Service/Hook Layer (`useAuth.ts`, `useTasks.ts`)**: Acts as intermediate domain controllers. They abstract away all Axios side effects and state transitions from the UI, ensuring components never touch the raw network.
- **Shared Contracts (`packages/types`)**: Both apps share a pure-type package (`@task-flow/types`), guaranteeing that API contracts (`UpdateTaskDto`, `JwtPayload`) are strictly enforced at compilation time.

---

## ✨ Features Matrix

| Feature | Description |
| :--- | :--- |
| **Multi-Tenant Security** | Secure signup and login flows. Task data is strictly isolated per unique `userId`. |
| **Full CRUD** | Complete capabilities to create, read, toggle, edit (inline), and delete tasks. |
| **Premium UI/UX** | Styled with `shadcn/ui`. Features glassmorphic navigation, inline edit fields, interactive tooltips, custom scrollbars, and fluid micro-animations. |
| **Dialog Confirmations** | Destructive actions (like logging out or deleting a task) are protected by `AlertDialog` modals. |
| **State Persistence** | Zustand securely persists your session token; your login state remains intact across reloads. |
| **Robust Error Handling** | Implements the **Early Return Pattern** across all hooks for highly readable, chronological error handling. |

---

## 💻 Tech Stack

### Monorepo
- **Package Manager**: `pnpm` Workspaces
- **Shared Contracts**: Pure TypeScript package (`packages/types`)

### Backend (API)
- **Framework**: NestJS (Express under the hood)
- **Language**: TypeScript (Strict Mode)
- **Security**: `bcryptjs`, `passport-jwt`

### Frontend (Web App)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, `shadcn/ui`, `tw-animate-css`
- **State Management**: Zustand (with Immer & Persist middleware)
- **Forms & Validation**: React Hook Form, Zod

---

## 🚀 Getting Started

### 1. Install Dependencies
Initialize the monorepo from the root directory:
```bash
pnpm install
```

### 2. Start Development Servers
Run both the NestJS API and the React Vite server simultaneously:
```bash
pnpm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`

### 3. Build & QA Commands
To verify the strict typings, lint the entire codebase, and ensure a clean build, use the following workspace commands:
```bash
# Run ESLint strictly across the monorepo
pnpm lint

# Build Backend
pnpm --filter api build

# Build Frontend
pnpm --filter web build
```

---

## 🔍 Clean Code & Refactoring Note
Task Flow adheres to strict **Clean Code** principles. In our recent refactorings, we completely eliminated nested `else` clauses within critical control flows and `catch` blocks. 

By employing the **Early Return Pattern**, our logic reads chronologically from top to bottom. It immediately intercepts and handles known conditions (like Axios network errors) and immediately `return`s, drastically reducing cognitive load and cyclomatic complexity.

```typescript
// Example from useTasks.ts
catch (err: unknown) {
  if (isAxiosError(err) && err.response?.data?.message) {
    setError(err.response.data.message);
    return;
  }
  setError('Failed to fetch tasks');
}
```
