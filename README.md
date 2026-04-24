<div align="center">
  <h1>Task Flow</h1>
  <p><strong>A Production-Ready, Multi-Tenant Task Management Platform</strong></p>
  <p>
    <a href="#overview">Overview</a> •
    <a href="#live-demo">Live Demo</a> •
    <a href="#system-architecture">Architecture</a> •
    <a href="#technology-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

<br />

## Overview

**Task Flow** is a full-stack, enterprise-grade task management application engineered for scalability, type safety, and optimal developer experience. It demonstrates production-ready patterns and strict adherence to **Domain-Driven Design (DDD)** principles within a modern **pnpm monorepo** architecture.

The platform provides secure, isolated multi-tenant task tracking with a highly polished, responsive user interface. It serves as a comprehensive reference architecture for building robust web applications with React, NestJS, and TypeScript.

---

## Live Demo

The application is currently deployed and accessible at:
**[http://13.229.212.222/](http://13.229.212.222/)**

*(Note: The database is currently in-memory. Data may reset during deployments or server maintenance.)*

---

## Core Features

- **Multi-Tenant Security**: Comprehensive signup and login workflows. Passwords are cryptographically hashed using `bcryptjs`. Data access is strictly isolated per authenticated subject (`sub`).
- **Complete Task Lifecycle**: Full CRUD (Create, Read, Update, Delete) capabilities, including inline title editing and completion toggling.
- **Premium User Interface**: Engineered with `shadcn/ui` and Tailwind CSS v4, featuring fluid micro-animations, glassmorphic navigation patterns, and accessible tooltips.
- **Destructive Action Guards**: Critical user actions (e.g., task deletion, logout) are safeguarded by modal confirmation dialogs to prevent accidental data loss.
- **Persistent Sessions**: JWT session tokens are securely persisted across browser reloads using Zustand's local storage middleware.
- **Linear Error Handling**: Implements the **Early Return Pattern** across the entire stack, ensuring network exceptions and validation failures are gracefully surfaced to the user interface.
- **Asynchronous State Management**: Real-time loading spinners and disabled states prevent race conditions and duplicate submissions during network requests.

---

## Technology Stack

### Package Management & Monorepo Configuration
| Technology | Purpose |
| :--- | :--- |
| **pnpm** | Strict dependency resolution, optimized disk usage, and workspace orchestration |
| **TypeScript** | End-to-end static typing to eliminate runtime type errors |

### Backend Infrastructure (NestJS API)
| Technology | Purpose |
| :--- | :--- |
| **NestJS** | Enterprise-grade Node.js framework leveraging decorators and dependency injection |
| **Passport.js / JWT** | Stateless, token-based authentication mechanism |
| **bcryptjs** | Secure 10-round salted password hashing |

### Frontend Client (React Web)
| Technology | Purpose |
| :--- | :--- |
| **React 19 & Vite** | High-performance component rendering and sub-millisecond Hot Module Replacement |
| **Tailwind CSS v4** | Utility-first styling with automatic purging |
| **shadcn/ui** | Headless, highly-customizable, and accessible component library |
| **Zustand & Immer** | Lightweight, immutable global state management |
| **React Hook Form & Zod** | Performant, schema-validated forms |

---

## System Architecture

Task Flow is built upon **Domain-Driven Design (DDD)** principles, organizing the codebase around cohesive business domains rather than disjointed technical layers.

### Monorepo Structure

The project utilizes a pnpm workspace to orchestrate multiple independent packages within a single repository context:

```text
task-flow/
├── apps/
│   ├── api/                 # NestJS Backend API
│   │   ├── src/auth/        # Auth Domain (Controllers, Services, Guards)
│   │   ├── src/tasks/       # Task Domain (Controllers, Services)
│   │   ├── src/app.module.ts
│   │   └── src/main.ts
│   └── web/                 # React SPA Client
│       ├── src/components/  # Presentation-only UI components
│       ├── src/pages/       # Layouts and smart pages
│       ├── src/hooks/       # Application logic abstraction
│       ├── src/store/       # Zustand global state definition
│       └── src/lib/         # Axios API instance and formatting utilities
├── packages/
│   └── types/               # Shared TypeScript DTOs and Interfaces
└── pnpm-workspace.yaml      # Monorepo configuration mapping
```

### Backend Architecture (NestJS)
The backend enforces strict domain boundaries to guarantee modularity and testability:
- **Authentication Domain (`src/auth`)**: Encapsulates password hashing (`bcryptjs`), stateless JWT generation, and Passport.js validation strategies. It prevents identity logic from bleeding into feature domains.
- **Task Domain (`src/tasks`)**: Manages multi-tenant CRUD operations. Controllers act purely as HTTP routers, instantly delegating business logic and data manipulation to the `TasksService`.
- **Zero-Implicit-Any**: Data Transfer Objects (DTOs) from `@task-flow/types` validate all incoming requests.

### Frontend Architecture (React)
The frontend implements a strict, tiered abstraction model:
- **Presentation Layer**: Dumb UI components (e.g., `TaskItem.tsx`) receive data explicitly via props and emit events via callbacks. They possess no knowledge of network states.
- **State & Persistence Layer**: Zustand (`useStore.ts`) serves as the single source of truth for global state, leveraging the `persist` middleware to automatically hydrate JWT tokens from `localStorage`.
- **Service/Hook Layer**: Custom hooks (e.g., `useTasks.ts`, `useAuth.ts`) encapsulate Axios network side effects, formatting data before passing it to the Presentation Layer.

---

## Getting Started

### Prerequisites
- **Node.js**: v20 or higher
- **pnpm**: v9 or higher

### 1. Installation
Clone the repository and install the workspace dependencies:

```bash
git clone https://github.com/PathumSandeepa/task-flow.git
cd task-flow
pnpm install
```

### 2. Running Development Servers
To boot both the NestJS API and the React Web application concurrently, execute:

```bash
pnpm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`

### 3. Build & Code Quality Commands
Ensure code consistency and compile the project using the following workspace commands:

```bash
pnpm lint     # Execute ESLint across all monorepo packages
pnpm build    # Compile all workspace applications for production
```

---

## Environment Configuration

### Backend (`apps/api/.env`)
| Variable | Default | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Target execution environment (`development`, `production`) |
| `PORT` | `3000` | Designated port for the NestJS HTTP server |
| `JWT_SECRET` | - | Cryptographic key for signing JWTs |

### Frontend (`apps/web/.env.local`)
| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:3000` | Base URI of the NestJS Backend API |

---

## Authentication & Security Model

Task Flow implements a stateless JWT architecture to maximize horizontal scalability:
1. Users authenticate via `/auth/login` using `bcryptjs` validated credentials.
2. The server issues a cryptographically signed JSON Web Token containing the user's `sub` (Subject ID).
3. The React client persists this token securely in `localStorage` via Zustand.
4. Axios interceptors automatically inject the `Authorization: Bearer <token>` header into all subsequent outgoing requests.
5. NestJS `JwtAuthGuard` intercepts incoming requests, validates the cryptographic signature, and explicitly enforces per-user data extraction, ensuring no user can access another's resources.

Because the system is stateless, there is no server-side session registry. Logout is handled purely on the client by purging the local Zustand token store.

---

## Application Programming Interface (API)

All authenticated endpoints require the `Authorization: Bearer <token>` header.

### Authentication Endpoints
- `POST /auth/signup` - Registers a new user account and returns an access token.
- `POST /auth/login` - Authenticates credentials and returns an access token.

### Task Endpoints
- `GET /tasks` - Retrieves all tasks isolated to the currently authenticated user.
- `POST /tasks` - Instantiates a new task.
- `PATCH /tasks/:id/toggle` - Inverts the boolean completion status of a specified task.
- `PATCH /tasks/:id` - Replaces the title of a specified task.
- `DELETE /tasks/:id` - Permanently destroys a specified task.

---

## Deployment Architecture

The application is deployed to a production-grade AWS EC2 environment using Nginx as a reverse proxy.

### 1. Infrastructure Specifications
- **Operating System**: Ubuntu 24.04 LTS
- **Compute Instance**: AWS EC2 t3.micro (2 vCPU, 1GB RAM)
- **Storage Volume**: 20GB gp3 Elastic Block Store
- **Security Groups**: 
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)

### 2. Server Provisioning & Swap Configuration
To accommodate the build requirements of Node.js within a 1GB RAM constraint, a swap file was provisioned:

```bash
# System Update
sudo apt update && sudo apt upgrade -y

# Install Core Dependencies (Node 20, pnpm, Nginx)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pnpm pm2

# Provision 2GB Swap File to prevent memory exhaustion during Vite/TypeScript builds
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 3. Application Build Process
```bash
git clone https://github.com/PathumSandeepa/task-flow.git
cd task-flow
pnpm install

# Map the Frontend to the Nginx Reverse Proxy namespace
echo "VITE_API_URL=/api" > apps/web/.env.local

# Execute Monorepo Build Phase
pnpm build
```

### 4. Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/default`)
Nginx is utilized to serve the static React frontend while cleanly proxying `/api` requests to the internal NestJS process running on port 3000.

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # 1. Serve the Compiled React SPA
    location / {
        root /home/ubuntu/task-flow/apps/web/dist;
        index index.html;
        # crucial for client-side routing
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy API requests to the Internal NestJS Backend
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Forward JWT Authorization headers to the NestJS layer
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }
}
```

---

## Known Limitations & Future Enhancements

- **In-Memory Data Store**: Tasks and users are currently stored in RAM. The next iteration will replace this layer with PostgreSQL via Prisma ORM to guarantee data persistence across server restarts.
- **Account Recovery**: A password reset flow utilizing a transactional email provider (e.g., SendGrid) is planned.
- **Rate Limiting**: Implementation of `@nestjs/throttler` is pending to mitigate brute-force authentication attempts.

---

## License

This project is licensed under the **MIT License**. You are permitted to use, modify, and distribute this software for personal and commercial purposes.
