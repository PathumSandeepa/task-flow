<div align="center">

# Task Flow

**A Production-Ready, Multi-Tenant Task Management Platform**

Built with NestJS · React 19 · TypeScript · pnpm Monorepo

---

[Overview](#overview) · [Live Demo](#live-demo) · [Features](#features) · [Tech Stack](#technology-stack) · [Architecture](#system-architecture) · [Getting Started](#getting-started) · [API Reference](#api-reference) · [Deployment](#deployment)

</div>

<br />

## Overview

Task Flow is a full-stack task management application engineered for scalability, type safety, and developer experience. The platform follows **Domain-Driven Design (DDD)** principles within a **pnpm monorepo** architecture, delivering secure multi-tenant task tracking with a polished, responsive interface.

It serves as a production-grade reference architecture for building robust web applications with React, NestJS, and end-to-end TypeScript.

---

## Live Demo

> **URL:** [http://13.229.212.222](http://13.229.212.222/)
>
> The application is deployed on AWS EC2 with Nginx reverse proxy. The database is currently in-memory — data may reset during deployments or server maintenance.

---

## Features

### Authentication & Security
- Signup and login workflows with `bcryptjs` salted password hashing (10 rounds)
- Stateless JWT-based session management with automatic token persistence
- Per-user data isolation enforced at the guard level — no cross-tenant access

### Task Management
- Full CRUD lifecycle: create, read, update, and delete tasks
- Inline title editing with optimistic UI updates
- One-click completion toggling with visual state feedback
- Task filtering by completion status (all, active, completed)

### User Experience
- Built with `shadcn/ui` and Tailwind CSS v4 for a modern, accessible interface
- Glassmorphic navigation with fluid micro-animations
- Confirmation dialogs on destructive actions (delete, logout) to prevent accidental data loss
- Real-time loading states and disabled controls to prevent duplicate submissions

---

## Technology Stack

### Monorepo & Tooling

| Technology | Role |
|:-----------|:-----|
| pnpm Workspaces | Dependency resolution, disk optimization, workspace orchestration |
| TypeScript | End-to-end static typing across all packages |
| GitHub Actions | Automated CI pipeline (lint + build verification) |

### Backend — NestJS API

| Technology | Role |
|:-----------|:-----|
| NestJS 11 | Enterprise Node.js framework with decorators and dependency injection |
| Passport.js + JWT | Stateless token-based authentication |
| bcryptjs | Cryptographic password hashing |
| @nestjs/config | Environment-aware configuration management |

### Frontend — React SPA

| Technology | Role |
|:-----------|:-----|
| React 19 + Vite 8 | Component rendering with sub-millisecond HMR |
| Tailwind CSS v4 | Utility-first styling with automatic tree-shaking |
| shadcn/ui + Radix UI | Accessible, headless component primitives |
| Zustand + Immer | Lightweight immutable state management with persistence |
| React Hook Form + Zod | Performant, schema-validated form handling |
| React Router v7 | Client-side routing and navigation |
| Axios | HTTP client with interceptor-based auth injection |

### Shared Packages

| Package | Role |
|:--------|:-----|
| @task-flow/types | Shared TypeScript DTOs and interfaces across frontend and backend |

---

## System Architecture

The project is organized around cohesive business domains rather than technical layers, following DDD principles.

### Repository Structure

```
task-flow/
├── apps/
│   ├── api/                       # NestJS Backend API
│   │   └── src/
│   │       ├── auth/              # Authentication domain
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.service.ts
│   │       │   ├── jwt.strategy.ts
│   │       │   └── jwt-auth.guard.ts
│   │       ├── tasks/             # Task domain
│   │       │   ├── tasks.controller.ts
│   │       │   └── tasks.service.ts
│   │       ├── app.module.ts
│   │       └── main.ts
│   │
│   └── web/                       # React SPA Client
│       └── src/
│           ├── components/        # Presentational UI components
│           │   ├── AddTaskForm.tsx
│           │   ├── FilterBar.tsx
│           │   ├── TaskItem.tsx
│           │   ├── TaskList.tsx
│           │   ├── ProtectedRoute.tsx
│           │   └── ui/            # shadcn/ui primitives
│           ├── pages/             # Route-level page components
│           │   ├── DashboardPage.tsx
│           │   ├── LoginPage.tsx
│           │   └── SignupPage.tsx
│           ├── hooks/             # Business logic abstraction
│           │   ├── useAuth.ts
│           │   └── useTasks.ts
│           ├── store/             # Zustand global state
│           ├── lib/               # Axios instance, utilities
│           └── App.tsx            # Root router configuration
│
├── packages/
│   └── types/                     # Shared TypeScript definitions
├── .github/workflows/main.yml     # CI pipeline configuration
├── pnpm-workspace.yaml
└── package.json
```

### Backend Design

The backend enforces strict domain boundaries:

- **Auth Domain** — Encapsulates user registration, credential validation, JWT token generation, and Passport.js strategy configuration. Identity logic is fully isolated from feature domains.
- **Task Domain** — Manages multi-tenant CRUD operations. Controllers serve as thin HTTP routers, delegating all business logic to the `TasksService`. Every query is scoped to the authenticated user's `sub` claim.
- **Type Safety** — All request/response contracts use shared DTOs from `@task-flow/types`, eliminating implicit `any` types.

### Frontend Design

The frontend follows a strict layered abstraction:

- **Presentation Layer** — Components like `TaskItem` and `AddTaskForm` receive data via props and emit events through callbacks. They have no knowledge of network or global state.
- **Hook Layer** — `useAuth` and `useTasks` encapsulate all Axios network calls, error handling, and data transformation before surfacing results to the UI.
- **State Layer** — Zustand store serves as the single source of truth. The `persist` middleware automatically hydrates JWT tokens from `localStorage` across browser sessions.
- **Routing Layer** — `ProtectedRoute` wraps authenticated pages, redirecting unauthenticated users to the login flow.

---

## Getting Started

### Prerequisites

| Requirement | Version |
|:------------|:--------|
| Node.js | v20+ |
| pnpm | v9+ |

### Installation

```bash
git clone https://github.com/PathumSandeepa/task-flow.git
cd task-flow
pnpm install
```

### Development

Start both the API and web client concurrently:

```bash
pnpm dev
```

| Service | URL |
|:--------|:----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |

### Build & Lint

```bash
pnpm build    # Compile all workspace packages for production
pnpm lint     # Run ESLint across all packages
```

---

## Environment Configuration

### Backend — `apps/api/.env`

| Variable | Default | Description |
|:---------|:--------|:------------|
| `NODE_ENV` | `development` | Execution environment (`development` or `production`) |
| `PORT` | `3000` | HTTP server port |
| `JWT_SECRET` | — | Cryptographic signing key for JWT tokens |

### Frontend — `apps/web/.env.local`

| Variable | Default | Description |
|:---------|:--------|:------------|
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the NestJS API |

---

## Authentication Flow

Task Flow uses a stateless JWT architecture designed for horizontal scalability:

```
1. User submits credentials via /auth/login
2. Server validates password hash with bcryptjs
3. Server issues a signed JWT containing the user's subject ID (sub)
4. Client persists the token in localStorage via Zustand persist middleware
5. Axios interceptors attach "Authorization: Bearer <token>" to all requests
6. NestJS JwtAuthGuard validates the token signature on every protected route
7. All data queries are scoped to the authenticated user's sub claim
```

Logout is handled client-side by clearing the Zustand token store. There is no server-side session registry.

---

## API Reference

All authenticated endpoints require the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/auth/signup` | Register a new account; returns access token |
| `POST` | `/auth/login` | Authenticate credentials; returns access token |

### Tasks

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/tasks` | Retrieve all tasks for the authenticated user |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/:id` | Update the title of a task |
| `PATCH` | `/tasks/:id/toggle` | Toggle task completion status |
| `DELETE` | `/tasks/:id` | Permanently delete a task |

---

## Deployment

The application is deployed to AWS EC2 with Nginx as a reverse proxy.

### Infrastructure

| Component | Specification |
|:----------|:-------------|
| OS | Ubuntu 24.04 LTS |
| Instance | AWS EC2 t3.micro (2 vCPU, 1 GB RAM) |
| Storage | 20 GB gp3 EBS |
| Ports | 22 (SSH), 80 (HTTP), 443 (HTTPS) |

### Server Setup

```bash
# System dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pnpm pm2

# Swap file (required for builds on 1 GB instances)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Build & Deploy

```bash
git clone https://github.com/PathumSandeepa/task-flow.git
cd task-flow
pnpm install

echo "VITE_API_URL=/api" > apps/web/.env.local
pnpm build
```

### Nginx Configuration

`/etc/nginx/sites-available/default`

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Serve the compiled React SPA
    location / {
        root /home/ubuntu/task-flow/apps/web/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to NestJS
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;

        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }
}
```

### CI/CD Pipeline

The project includes a GitHub Actions workflow that runs on every push and pull request to `main`:

1. **Lint** — Installs dependencies and executes `pnpm lint` across all packages
2. **Build** — Compiles both the API and web applications to verify production readiness

---

## Roadmap

| Priority | Enhancement | Details |
|:---------|:------------|:--------|
| High | Persistent Database | Replace in-memory store with PostgreSQL via Prisma ORM |
| Medium | Password Recovery | Email-based reset flow using a transactional provider (e.g., SendGrid) |
| Medium | Rate Limiting | Brute-force mitigation via `@nestjs/throttler` |
| Low | Role-Based Access | Team workspaces with admin/member permissions |

---

## License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software for personal and commercial purposes.
