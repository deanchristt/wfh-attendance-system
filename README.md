# Dexa Group — Fullstack Developer Skill Test

Implementation of the **"Aplikasi Absensi WFH Karyawan"** + **"Aplikasi Monitoring Karyawan"** use cases from
the Fullstack Developer Skill Test brief, built as a small microservices system.

## Use case coverage

**1. Aplikasi Absensi WFH Karyawan** (`frontend-employee/`)
- Login with company email + password.
- **Profil Karyawan**: view name / company email / photo / position / phone number; edit photo, phone number,
  password. Every change publishes an event that (a) pushes a real-time popup to the admin app over WebSocket,
  and (b) is streamed through RabbitMQ into a dedicated audit database (`dexa_audit`), separate from the main
  employee database.
- **Absen**: check-in / check-out, capturing date, time and status (`MASUK` / `PULANG`), with same-day
  duplicate/ordering guards (can't check in twice, can't check out before checking in).
- **Summary Absen**: defaults to "start of month → today", with a date-range filter.

**2. Aplikasi Monitoring Karyawan** (`frontend-admin/`)
- HRD-only login.
- Add / update employee data.
- Read-only view of every employee's submitted attendance, with employee + date-range filters.
- Real-time popup whenever an employee updates their profile.

Both frontends are plain REST consumers of the same backend — the "microservices" requirement.

## Architecture

```
                         ┌─────────────────────┐        ┌─────────────────────┐
                         │ frontend-employee    │        │ frontend-admin       │
                         │ (React, Vite)        │        │ (React, Vite)        │
                         └──────────┬────────────┘        └──────────┬───────────┘
                                    │ REST (JWT)                     │ REST (JWT) + WebSocket
                                    ▼                                 ▼
                         ┌─────────────────────────────────────────────────┐
                         │                      gateway                     │
                         │  REST API edge · JWT verify · Swagger (/docs)    │
                         │  Socket.IO (/notifications) · photo upload       │
                         └───────┬───────────────┬───────────────┬─────────┘
                       RabbitMQ  │     RabbitMQ   │    RabbitMQ   │ RabbitMQ (event)
                       (RPC)     ▼     (RPC)      ▼    (event)    ▼
                   ┌────────────────┐ ┌──────────────────┐  ┌─────────────────┐
                   │ identity-service│ │attendance-service │  │  audit-service   │
                   │ employees, auth │ │ check-in/out,     │  │ profile-change   │
                   │ (dexa_identity) │ │ summaries         │  │ log consumer     │
                   └────────┬────────┘ │ (dexa_attendance) │  │ (dexa_audit)     │
                            │          └──────────┬────────┘  └────────┬─────────┘
                            ▼                     ▼                    ▼
                        Postgres               Postgres             Postgres
                     (dexa_identity)        (dexa_attendance)      (dexa_audit)
```

- Each service owns its own Postgres database — no cross-service joins; the gateway composes data from
  multiple services in application code (e.g. `GET /admin/attendance` merges attendance rows from
  `attendance-service` with employee names from `identity-service`).
- `identity-service`, `attendance-service` and `gateway↔notify` communicate purely through **RabbitMQ**
  (`@nestjs/microservices`, RMQ transport) — no direct HTTP between services.
- A profile update emits one event to **two** queues: `audit_events_queue` (consumed by `audit-service`,
  written to the separate `dexa_audit` database) and `notify_events_queue` (consumed by the `gateway`, which
  re-broadcasts it over Socket.IO to any connected admin browser).

## Tech stack

| Layer | Choice |
|---|---|
| Backend | NestJS (TypeScript), microservices via `@nestjs/microservices` (RabbitMQ transport) |
| Database | PostgreSQL (one database per service) via TypeORM |
| Message queue | RabbitMQ |
| Real-time notification | WebSocket (Socket.IO) |
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Auth | JWT (`@nestjs/jwt` + Passport), verified locally at the gateway |

## Project layout

```
backend/              NestJS monorepo (gateway, identity-service, attendance-service, audit-service, libs/common)
frontend-employee/     Employee-facing WFH attendance app
frontend-admin/        HRD admin monitoring app
infra/init-db.sql      Creates the 3 databases on first Postgres boot (Docker Compose only)
docker-compose.yml     One-command bring-up of the whole stack
```

## Running with Docker Compose (recommended for review)

```bash
docker compose up --build
```

This starts Postgres, RabbitMQ, all 4 backend services, and both frontends.

- Employee app: http://localhost:5173
- Admin app: http://localhost:5174
- Gateway REST API + Swagger docs: http://localhost:3000/docs
- RabbitMQ management UI: http://localhost:15672 (guest/guest)

## Running locally without Docker

Prerequisites: Node.js ≥ 20.19 (or ≥ 22), a local PostgreSQL instance, a local RabbitMQ instance.

```bash
# 1. Databases (run once)
psql -U <your-pg-user> -h localhost -d postgres -c "CREATE DATABASE dexa_identity;"
psql -U <your-pg-user> -h localhost -d postgres -c "CREATE DATABASE dexa_attendance;"
psql -U <your-pg-user> -h localhost -d postgres -c "CREATE DATABASE dexa_audit;"

# 2. RabbitMQ (macOS example)
brew install rabbitmq && brew services start rabbitmq

# 3. Backend — copy backend/.env.example to backend/.env and adjust DB credentials, then:
cd backend && npm install
npm run start:identity      # terminal 1
npm run start:attendance    # terminal 2
npm run start:audit         # terminal 3
npm run start:gateway       # terminal 4

# 4. Frontends
cd frontend-employee && npm install && npm run dev    # http://localhost:5173
cd frontend-admin && npm install && npm run dev       # http://localhost:5174
```

On first boot, `identity-service` seeds one admin and two sample employees (see below) if the employees
table is empty.

## Default seeded accounts

| Role | Email | Password |
|---|---|---|
| Admin (HRD) | `admin@dexagroup.com` | `password123` |
| Employee | `budi.santoso@dexagroup.com` | `password123` |
| Employee | `siti.aminah@dexagroup.com` | `password123` |

## API reference

Interactive Swagger UI is served by the gateway at `/docs` (http://localhost:3000/docs) once it's running,
covering `/auth`, `/profile`, `/attendance` and `/admin/*`.

## Notes / design decisions

- **Why RabbitMQ twice (audit + notify) instead of one queue**: `@nestjs/microservices`' RMQ transport is
  point-to-point per declared queue. Rather than hand-roll a fanout exchange, `identity-service` simply emits
  the same event to two independently-declared queues — simpler to read, and each consumer only cares about
  its own queue.
- **Why JWT is verified locally at the gateway** instead of calling `identity-service` for every request:
  avoids a network round-trip per request; the gateway and `identity-service` share the same `JWT_SECRET`.
- **Why attendance date/time are server-stamped**, not client-supplied: prevents an employee from
  backdating/forging an attendance record from the browser.
- Uploaded profile photos are stored on a local disk volume (`backend/uploads/photos`, served by the
  gateway at `/uploads/...`) — enough for this assessment; swapping in S3/GCS would only touch
  `ProfileController.uploadPhoto`.
