# NestJS Authentication, CRUD API, and Workflow Engine

This project is a comprehensive backend RESTful API built with NestJS, TypeORM, and PostgreSQL. It provides authentication, user management, and a robust workflow engine to support complex, custom workflows.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Key Features](#key-features)
4. [Tech Stack](#tech-stack)
5. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Application](#running-the-application)
6. [Environment Variables](#environment-variables)
7. [Run Instructions](#run-instructions)

---

## Project Overview

This project implements a complete RESTful API, combining user authentication, secure CRUD operations, and a modular workflow engine that allows users to create, update, retrieve, and execute workflows with ease. The application is highly extensible, allowing the addition of custom workflow nodes to suit a wide range of use cases.

---


## Project Structure

```plaintext
src/
├── audit/
│   ├── audit.entity.ts
│   ├── audit.module.ts
│   ├── audit.service.ts
├── auth/
│   ├── decorators/
│   │   ├── public.decorator.ts
│   │   ├── roles.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── local-auth.guard.ts
│   │   ├── roles.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
├── events/
│   ├── events.gateway.ts
│   ├── events.module.ts
├── filters/
│   ├── http-exception.filter.ts
├── health/
│   ├── health.controller.ts
│   ├── health.module.ts
├── task-queue/
│   ├── task-queue.config.ts
│   ├── task-queue.module.ts
│   ├── workflow.processor.ts
│   ├── workflow.processor.spec.ts
│   ├── workflow.scheduler.ts
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.controller.spec.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.service.spec.ts
├── utils/
│   ├── logger.module.ts
│   ├── logger.service.ts
├── workflows/
│   ├── dto/
│   │   ├── create-node.dto.ts
│   │   ├── create-workflow.dto.ts
│   │   ├── update-workflow.dto.ts
│   ├── entities/
│   │   ├── execution-state.entity.ts
│   │   ├── node.entity.ts
│   │   ├── workflow.entity.ts
│   ├── services/
│   │   ├── node.service.ts
│   │   ├── state.service.ts
│   │   ├── workflow.service.ts
│   │   ├── workflow.service.spec.ts
│   ├── workflows.controller.ts
│   ├── workflows.controller.spec.ts
│   ├── workflow.module.ts
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
└── main.ts


## Key Features

- JWT Authentication: User authentication using JWT (JSON Web Tokens).
- Role-Based Authorization: Routes are restricted based on user roles.
- User Management: Full CRUD operations on user entities with secure access.
- Workflow Engine:
  - Customizable Workflow Nodes: Design and execute custom workflows.
  - Supported Node Types: Start, End, Condition, Wait nodes for branching logic.
- Task Queue for Workflow Execution: Asynchronous and reliable execution using Bull and Redis.
- Docker Support: Easily set up the environment using Docker Compose.

---

## Tech Stack

- NestJS: Progressive Node.js framework for building scalable server-side applications.
- TypeORM: Powerful ORM for interacting with PostgreSQL.
- PostgreSQL: Open-source relational database for efficient data storage.
- Passport: Authentication middleware for JWT and local strategies.
- Bull: A queue system backed by Redis for managing background tasks.
- Redis: In-memory data structure store used for task queue management.

---

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running locally without Docker)
- Redis (if running locally without Docker)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PratikBidve/Nest-assignment.git
   cd Nest-assignment
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Ensure you have the latest version of Node.js installed to avoid compatibility issues.

### Running the Application

You can run the application either with Docker (recommended) or directly on your local environment.

#### Using Docker (Recommended)

1. Build and start services using Docker Compose:

   ```bash
   docker compose up --build  # For the first time
   docker compose up          # Subsequent runs
   ```

2. Access the API at [http://localhost:3000](http://localhost:3000).

#### Running Locally Without Docker

1. Configure your environment variables (see below).
2. Start PostgreSQL and Redis services locally.
3. Run the application:

   ```bash
   npm run start
   ```

---

## Environment Variables

The following environment variables are required to run the application. They are pre-configured in the `docker-compose.yaml` file for Docker setup:

```yaml
environment:
  - DB_TYPE=postgres
  - PG_HOST=db
  - PG_USER=postgres
  - PG_PASSWORD=postgres
  - PG_DB=postgres
  - PG_PORT=5432
  - JWT_SECRET=your_jwt_secret_key
  - REDIS_HOST=redis
  - REDIS_PORT=6379
```

For local setup without Docker, create a `.env` file in the root directory and add the environment variables:

```env
DB_TYPE=postgres
PG_HOST=localhost
PG_USER=your_db_user
PG_PASSWORD=your_db_password
PG_DB=your_db_name
PG_PORT=5432
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Configuration Notes

- DB_TYPE: Should always be `postgres` for PostgreSQL.
- PG_HOST, PG_USER, PG_PASSWORD, PG_DB, PG_PORT: Database connection details.
- JWT_SECRET: Secret key for signing JSON Web Tokens.
- REDIS_HOST, REDIS_PORT: Redis connection details.

---

## Run Instructions

### Starting the Application

1. Development Mode:

   ```bash
   npm run start:dev
   ```

   This command starts the application in watch mode, automatically restarting on code changes.

2. Production Mode:

   ```bash
   npm run start:prod
   ```

   This command compiles the TypeScript code and runs the compiled JavaScript.

### Testing

1. Unit Tests:

   ```bash
   npm run test
   ```

   Runs all unit tests using Jest.

2. End-to-End Tests:

   ```bash
   npm run test:e2e
   ```

   Runs e2e tests to verify the system’s behavior from an external perspective.

3. Linting:

   ```bash
   npm run lint
   ```

   Runs the ESLint checker for code quality and consistency.

---

## Contact

For more information or inquiries regarding this project, please reach out to the development team via
email at prateekbidve@gmail.com
