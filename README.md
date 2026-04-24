<div align="center">
  <h1>🚀 Task Flow</h1>
  <p><strong>A Production-Ready, Multi-Tenant Task Management Platform</strong></p>
  <p>Built with <strong>NestJS</strong>, <strong>React 19</strong>, <strong>Vite</strong>, <strong>Tailwind CSS v4</strong>, and <strong>shadcn/ui</strong></p>
  <p>
    <a href="#-getting-started"><strong>Quick Start</strong></a> •
    <a href="#-tech-stack"><strong>Tech Stack</strong></a> •
    <a href="#-features"><strong>Features</strong></a> •
    <a href="#-architecture"><strong>Architecture</strong></a>
  </p>
</div>

---

## 📖 Overview

**Task Flow** is a full-stack, enterprise-grade task management application architected for **scale, type safety, and developer experience**. It demonstrates production-ready patterns and best practices in a modern **pnpm monorepo** structure with strict **Domain-Driven Design (DDD)** principles.

Whether you're managing personal productivity or team workflows, Task Flow provides secure, isolated multi-tenant task tracking with a highly polished, glassmorphic UI.

---

## 🏗️ Architecture

Task Flow is built on **Domain-Driven Design (DDD)** principles, organizing the codebase around business domains rather than technical layers.

### 🏢 Monorepo Structure
The project utilizes a pnpm workspace to orchestrate multiple packages under a single repository:
- `apps/api`: NestJS Backend handling business logic and data persistence.
- `apps/web`: React SPA serving as the user-facing client.
- `packages/types`: A shared TypeScript package containing strictly typed DTOs, interfaces, and contracts.

### 🛡️ Backend Architecture (NestJS)
The backend is completely decoupled by domain:
- **Authentication Domain (`src/auth`)**: Encapsulates password hashing (`bcryptjs`), stateless JWT generation, and Passport.js validation strategies.
- **Task Domain (`src/tasks`)**: Manages isolated multi-tenant CRUD operations. Controllers act purely as routers, immediately delegating business logic to the `TasksService`.

### 🖥️ Frontend Architecture (React)
The frontend implements a tiered architecture:
- **Presentation Layer**: Dumb UI components (`TaskItem.tsx`) receive data strictly via props.
- **State & Persistence Layer**: Zustand (`useStore.ts`) handles global state and leverages the `persist` middleware to save JWT tokens to `localStorage`.
- **Service/Hook Layer**: Custom hooks (`useTasks.ts`, `useAuth.ts`) abstract Axios network side effects and implement the **Early Return Pattern** for linear error handling.

---

## ✨ Features

- **🔐 Multi-Tenant Security**: Secure signup and login flows. Passwords are hashed with `bcryptjs`. All task data is strictly isolated per authenticated subject (`sub`).
- **✅ Full Task Lifecycle**: Complete CRUD capabilities including creation, reading, inline title editing, and completion toggling.
- **🎨 Premium UI/UX**: Styled with `shadcn/ui` and Tailwind CSS v4. Features fluid animations, glassmorphic navbars, and accessible tooltips.
- **⚠️ Destructive Action Safety**: Critical actions like task deletion are protected by `AlertDialog` modals.
- **💾 Persistent Sessions**: Zustand securely persists your JWT session token across browser reloads.
- **🚨 Robust Error Handling**: Flat, linear error handling via the Early Return pattern ensures network errors and validation failures are gracefully displayed.
- **⚡ Real-Time Loading States**: UI elements feature loading spinners and disabled states during asynchronous operations to prevent double-submissions.

---

## 🛠️ Tech Stack

### 🏢 Package Management & Monorepo
| Technology | Purpose |
| :--- | :--- |
| **pnpm** | Strict dependency resolution and workspace orchestration |
| **TypeScript** | End-to-end type safety catching bugs at compile-time |

### 🛡️ Backend (API)
| Technology | Purpose |
| :--- | :--- |
| **NestJS** | Enterprise-grade Node.js framework with dependency injection |
| **Passport.js / JWT** | Stateless, token-based authentication |
| **bcryptjs** | Secure 10-round salted password hashing |

### 🖥️ Frontend (Web)
| Technology | Purpose |
| :--- | :--- |
| **React 19 & Vite** | Lightning-fast component rendering and HMR development |
| **Tailwind CSS v4** | Utility-first styling with automatic purging |
| **shadcn/ui** | Headless, highly-customizable accessible components |
| **Zustand & Immer** | Lightweight, immutable global state management |
| **React Hook Form & Zod** | Performant schema-validated forms |

---

## 📁 Project Structure

```text
task-flow/
├── apps/
│   ├── api/                 # NestJS Backend API
│   │   ├── src/auth/        # Auth Domain (Controllers, Services, Guards)
│   │   ├── src/tasks/       # Task Domain (Controllers, Services)
│   │   ├── src/app.module.ts
│   │   └── src/main.ts
│   └── web/                 # React + Vite Frontend
│       ├── src/components/  # Dumb UI components (TaskItem, FilterBar, ui/)
│       ├── src/pages/       # Smart layout pages (Dashboard, Login, Signup)
│       ├── src/hooks/       # Logic abstraction (useAuth, useTasks)
│       ├── src/store/       # Zustand global state (useStore)
│       └── src/lib/         # Axios API instance and utilities
├── packages/
│   └── types/               # Shared TypeScript DTOs and Interfaces
└── pnpm-workspace.yaml      # Monorepo configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- pnpm v9+ (`npm install -g pnpm`)

### 1. Installation
```bash
git clone https://github.com/PathumSandeepa/task-flow.git
cd task-flow
pnpm install
```

### 2. Running Development Servers
```bash
# Starts both the NestJS API and React Web app in parallel
pnpm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`

### 3. Build & Lint Commands
```bash
pnpm lint     # Run ESLint across the entire monorepo
pnpm build    # Compile all workspace applications
```

---

## 🌍 Environment Variables

### Backend (`apps/api/.env`)
| Variable | Default | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Environment mode (`development`, `production`) |
| `PORT` | `3000` | Port for the NestJS server |
| `JWT_SECRET` | - | Secret key for signing JWTs (Must be secure in prod) |

### Frontend (`apps/web/.env.local`)
| Variable | Default | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the NestJS Backend API |

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm run dev` | Starts all applications in development mode |
| `pnpm lint` | Runs ESLint across all packages |
| `pnpm build` | Builds both frontend and backend for production |
| `pnpm --filter api test` | Runs unit tests for the backend |
| `pnpm --filter web preview` | Previews the built frontend production bundle locally |

---

## 🔌 API Overview

### Authentication (`/auth`)
- `POST /auth/signup` - Registers a new user and returns a JWT.
- `POST /auth/login` - Authenticates a user and returns a JWT.

### Tasks (`/tasks`) - Requires JWT Bearer Token
- `GET /tasks` - Retrieves all tasks isolated to the authenticated user.
- `POST /tasks` - Creates a new task.
- `PATCH /tasks/:id/toggle` - Toggles the completion status of a task.
- `PATCH /tasks/:id` - Updates the title of a task.
- `DELETE /tasks/:id` - Deletes a specific task.

---

## 🔐 Authentication & Security

Task Flow implements a **Stateless JWT Architecture**:
1. Users authenticate via `/auth/login` using `bcryptjs` validated credentials.
2. The server issues a cryptographically signed JWT containing the user's `sub` (ID).
3. The React client persists this token in `localStorage` via Zustand.
4. Axios interceptors automatically inject `Authorization: Bearer <token>` into all subsequent requests.
5. NestJS `JwtAuthGuard` intercepts requests, validates the signature, and ensures strictly isolated per-user data extraction.

There is no logout endpoint; sessions are invalidated purely client-side by purging the local Zustand store.

---

## 🎛️ State Management (Frontend)

We use **Zustand** combined with **Immer** and **Persist** middlewares for global state.

```typescript
// useStore.ts (State Shape)
{
  token: string | null;  // Persisted to localStorage
  tasks: Task[];         // In-memory array of user tasks
  loading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';
  
  // Actions
  login: (token: string) => void;
  logout: () => void;
  setTasks: (tasks: Task[]) => void;
  // ...
}
```
Zustand drastically reduces boilerplate compared to Redux, while Immer allows mutative syntax that compiles down to immutable state updates.

---

## 🌐 Deployment (AWS EC2 Production Setup)

The following deployment structure outlines a production-grade AWS EC2 environment using Nginx as a reverse proxy.

### 1. Infrastructure Specifications
- **OS**: Ubuntu 24.04 LTS
- **Instance**: t3.micro (2 vCPU, 1GB RAM - Free Tier eligible)
- **Storage**: 20GB gp3 (accommodates node_modules and build artifacts)
- **Security Groups**: Port 22 (SSH), Port 80 (HTTP), Port 443 (HTTPS) allowed globally.

### 2. Server Provisioning
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js v20, pnpm, pm2, and Nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pnpm pm2

# Allocate 2GB Swap File to prevent memory exhaustion during builds
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 3. Application Setup
```bash
git clone https://github.com/PathumSandeepa/task-flow.git
cd task-flow
pnpm install

# Configure Frontend to hit the Nginx Proxy (/api)
echo "VITE_API_URL=/api" > apps/web/.env.local

# Build the Monorepo
pnpm build
```

### 4. Nginx Configuration (`/etc/nginx/sites-available/default`)
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Serve the React Frontend SPA
    location / {
        root /home/ubuntu/task-flow/apps/web/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to the NestJS Backend
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Forward JWT Authorization headers to NestJS
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }
}
```

---

## ⚠️ Known Limitations

| Limitation | Impact | Workaround |
| :--- | :--- | :--- |
| **In-Memory Data Store** | Tasks and users are stored in RAM. Data resets on server restart. | For true production use, integrate a persistent database (e.g., PostgreSQL via Prisma ORM). |
| **No Password Reset** | Forgotten passwords cannot be recovered. | Integrate an email service (SendGrid) and a token-based reset flow. |
| **Rate Limiting** | API is susceptible to brute-force auth attempts. | Implement `@nestjs/throttler` to cap IP request velocity. |

---

## 🔧 Troubleshooting

- **CORS Errors**: Ensure the backend's `main.ts` has `app.enableCors()` pointing exactly to the frontend origin (e.g., `http://localhost:5173` or your production domain).
- **401 Unauthorized**: Ensure your frontend has successfully acquired the JWT and that Axios is correctly appending the `Authorization: Bearer <token>` header. If the token is expired, sign in again.
- **Out of Memory during Build**: On low-RAM instances (like EC2 t3.micro), V8 garbage collection can fail. Ensure the 2GB Swap file is properly allocated and activated as per the deployment guide.

---

## 📝 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software for both personal and commercial purposes.
