# Dexa WFH & Employee Management System (Core API)

A production-grade NestJS monorepo microservices backend for managing employee records, Work From Home (WFH) attendance tracking, and Role-Based Access Control (RBAC).

---

## Overview

Dexa Core API acts as the back-end WFH attendance and employee management system implementing a microservice architecture built with NestJS. It handles client routing, user authentication, file storage integration, and database operations.

---

## Tech Stack

* **Framework**: [NestJS 11](https://nestjs.com/)
* **Runtime & Language**: [Node.js 20](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)
* **Database**: [MySQL 8](https://www.mysql.com/)
* **Storage**: S3 Compatible Storage (e.g., [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/) / [MinIO](https://min.io/))

---

## Core Architecture & Features

The system is structured as a NestJS monorepo with an **API Gateway** and four decoupled **Microservices** communicating via TCP:

| Service Name | Protocol & Port | Key Responsibilities & Features | Dependencies / Integration |
| :--- | :--- | :--- | :--- |
| **API Gateway** (`api-gateway`) | HTTP `9000` | • Single client entry point with CORS enabled<br>• Request routing, global exception filters, and interceptors<br>• Exposes interactive Swagger UI documentation at `/api/docs`<br>• Exposes a health check endpoint at `/health` to monitor the status of the gateway and all connected microservices | Internal microservices via TCP |
| **Auth Service** (`auth-svc`) | TCP `9001` | • Stateless JWT authentication (access & refresh tokens)<br>• Role-Based Access Control (RBAC) supporting `admin`, `hr`, and `employee`<br>• Secure token refresh flow and blacklist/delete token on logout | MySQL (`users`, `roles`, `refresh_tokens`) |
| **File Service** (`file-svc`) | TCP `9002` | • Interacts with S3-compatible cloud object storage<br>• Handles asset uploads (e.g., attendance photos) and presigned URLs | S3 Compatible Storage (Cloudflare R2 / MinIO) |
| **Attendance Service** (`attendance-svc`) | TCP `9003` | • Records daily check-ins and check-outs with photos<br>• Validates work shift rules under timezone settings (`Asia/Jakarta`) | MySQL (`attendances`) |
| **Employee Service** (`employee-svc`) | TCP `9004` | • Manages departments and employee record details<br>• Profiles, employment status (`permanent`, `contract`, `intern`), and histories | MySQL (`employees`, `departments`) |

---

## Directory Structure

```text
dexa-core/
├── apps/
│   ├── api-gateway/       # HTTP gateway, routing, controllers, Swagger, filters
│   ├── attendance-svc/    # Attendance logging & microservice controllers
│   ├── auth-svc/          # Authentication logic, token management & RBAC
│   ├── employee-svc/      # Department and employee CRUD logic
│   └── file-svc/          # Cloudflare R2 / S3 storage integration
├── libs/
│   ├── common/            # Shared guards, decorators, interceptors, DTO helpers
│   └── database/          # Database connection, schemas, migrations, and seed scripts
├── Dockerfile             # Multi-service target Dockerfile
└── docker-compose.yml     # Local services and database orchestration
```

---

## Database Schema & ERD

The interactive entity relationship diagram (ERD) and detailed database table schemas can be viewed here:

👉 **[Dexa WFH & Employee Management System ERD](https://dbdocs.io/saddanakbar/Dexa-WFH-and-Employee-Management-System?view=relationships)**

---

## Environment Variables

Copy `.env.example` to `.env` and adjust the variables accordingly.

| Variable Name | Example / Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `9000` | Port for the API Gateway |
| `AUTH_PORT` | `9001` | TCP Port for Auth Service |
| `AUTH_HOST` | `127.0.0.1` | Host address for Auth Service |
| `FILE_PORT` | `9002` | TCP Port for File Service |
| `FILE_HOST` | `127.0.0.1` | Host address for File Service |
| `ATTENDANCE_PORT` | `9003` | TCP Port for Attendance Service |
| `ATTENDANCE_HOST` | `127.0.0.1` | Host address for Attendance Service |
| `EMPLOYEE_PORT` | `9004` | TCP Port for Employee Service |
| `EMPLOYEE_HOST` | `127.0.0.1` | Host address for Employee Service |
| `DATABASE_URL` | `mysql://dexa:dexa@127.0.0.1:3306/dexa_db` | MySQL Connection String |
| `JWT_SECRET` | `hydhoup_jouck_oui` | Secret key used to sign JWTs |
| `JWT_EXPIRY` | `1d` | Expiration time for access token |
| `OFFICE_TIMEZONE` | `Asia/Jakarta` | Timezone context for attendance tracking |
| `S3_STORAGE_ENDPOINT` | `http://127.0.0.1:9000` | S3 Compatible endpoint (R2/MinIO) |
| `S3_STORAGE_REGION` | `us-east-1` | S3 storage region |
| `S3_STORAGE_ACCESS_KEY_ID`| `this_is_access_key` | Access key credential |
| `S3_STORAGE_SECRET_ACCESS_KEY` | `this_is_secret_key` | Secret key credential |
| `S3_STORAGE_BUCKET_NAME` | `dexa-bucket` | Target bucket name |
| `S3_STORAGE_FORCE_PATH_STYLE` | `true` | Force S3 path style (e.g. for MinIO) |
| `S3_STORAGE_PUBLIC_URL` | `http://127.0.0.1:9000/dexa-bucket` | Public URL prefix for serving assets |

### Cloudflare R2 Configuration Example

Since i tested the S3 using S3 cloud like R2 Cloudflare, then if you are using Cloudflare R2 too as your S3-compatible storage, use the following `.env` settings:

```env
S3_STORAGE_ENDPOINT=https://<cloudflare-account-id>.r2.cloudflarestorage.com
S3_STORAGE_REGION=auto
S3_STORAGE_ACCESS_KEY_ID=<your-r2-access-key-id>
S3_STORAGE_SECRET_ACCESS_KEY=<your-r2-secret-access-key>
S3_STORAGE_BUCKET_NAME=<your-r2-bucket-name>
S3_STORAGE_FORCE_PATH_STYLE=false
S3_STORAGE_PUBLIC_URL=https://pub-<hash>.r2.dev
```

---

## Getting Started

### Prerequisites

Ensure **Node.js (v20+)** and **npm** are installed.

### Installation & Run

1. Clone the repository and navigate to the directory:
   ```bash
   git clone <repository-url>
   cd dexa-core
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Database Migrations and Seeding:
   Ensure you have a running MySQL instance matching the credentials in `.env`, then run:
   ```bash
   # Generate migrations from Drizzle schemas
   npm run db:generate

   # Apply migrations to database
   npm run db:migrate

   # Seed default database records
   npm run db:seed
   ```

5. Run microservices:
   ```bash
   # Starts all services concurrently in watch mode
   npm run start:all
   ```

   Alternatively, you can run services individually:
   ```bash
   npm run start:gateway
   npm run start:auth
   npm run start:file
   npm run start:attendance
   npm run start:employee
   ```

### Default Credentials (Seeded Users)

All seeded accounts use the default password: **`password123`**

* **Admin**: `admin@dexa.com`
* **HR**: `hr@dexa.com`
* **Employees**:
  * `kazhim@dexa.com`
  * `saddan@dexa.com`
  * `zulfan@dexa.com`

---

## Production Deployment

A single [Dockerfile](file:///Dockerfile) is configured to build the monorepo. Use [docker-compose.yml](file:///docker-compose.yml) to spin up all services together with the MySQL database.

### Running with Docker Compose

1. Create a Docker network (if not already existing):
   ```bash
   docker network create dexa-network
   ```
2. Create a persistent volume for MySQL:
   ```bash
   docker volume create dexa-db-data
   ```
3. Run the orchestration:
   ```bash
   docker compose up -d --build
   ```

---

## API Documentation

Once the API Gateway is running, you can access the interactive Swagger UI documentation at:
**[http://localhost:9000/api/docs](http://localhost:9000/api/docs)**