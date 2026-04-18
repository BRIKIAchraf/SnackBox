# Pizza Platform Monorepo

Welcome to the Pizza Platform! This is an enterprise-grade monorepo setup for a state-of-the-art pizza ordering system.

## Architecture

This platform is structured around a monorepo consisting of:

- **Apps**:
  - `client`: Next.js frontend for clients.
  - `admin`: Next.js dashboard for platform management (secure, RBAC).
  - `api`: NestJS backend API (/v1).
  - `worker`: Standalone job worker for asynchronous tasks (emails, Webhook processing, Kitchen Live Updates).

- **Packages**:
  - `database`: Prisma schema, migrations, and seeds.
  - `types`: Shared types, Enums, DTOs to enforce strict type synchronization across apps.
  - `ui`: Shared UI components for frontend apps.
  - `config`: Shared base configurations.

- **Infra**:
  - `infra/docker`: Complete local environment orchestration featuring PostgreSQL, Redis, API, and background workers.

## Prerequisites
- Node.js (v18+)
- Docker
