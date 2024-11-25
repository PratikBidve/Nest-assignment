---

# NestJS Authentication, CRUD API, and Workflow Engine

This project is a RESTful API built with **NestJS**, **TypeORM**, and **PostgreSQL**. It provides user authentication with **JWT**, role-based authorization, secure CRUD operations on a **User** resource, and a powerful, extensible **workflow engine**.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Tech Stack](#tech-stack)  
3. [Setup Instructions](#setup-instructions)  
   - [Installation](#installation)  
   - [Running the Application](#running-the-application)  
   - [Environment Variables](#environment-variables)  
4. [API Documentation](#api-documentation)  
   - [Auth Endpoints](#auth-endpoints)  
   - [User CRUD Endpoints](#user-crud-endpoints)  
   - [Workflow Endpoints](#workflow-endpoints)  
   - [Task Queue Endpoints](#task-queue-endpoints)  
5. [Project Structure](#project-structure)  
6. [Workflow Engine](#workflow-engine)  
   - [Supported Node Types](#supported-node-types)  
   - [Workflow Schema](#workflow-schema)  
   - [Execution Flow](#execution-flow)  
   - [Examples](#examples)  
7. [License](#license)

---

## Project Overview

### Key Features

- **Authentication and Authorization**:
  - **User Registration and Login** using JWT-based authentication.
  - **Role-Based Authorization** to restrict access to specific routes.
- **Secure CRUD Operations** on the User entity with authentication.
- **Modular Workflow Engine**:
  - Design and execute custom workflows with various node types.
  - Extensible and scalable to meet complex workflow requirements.
- **Task Queue for Workflow Execution**:
  - Asynchronous and reliable workflow execution using Bull and Redis.
- **Modular Architecture**:
  - Uses NestJS modules for separation of concerns, ensuring maintainability and scalability.

---

## Tech Stack

- **NestJS**: A progressive Node.js framework for scalable server-side applications.
- **TypeORM**: An ORM for interacting with PostgreSQL for efficient database management.
- **PostgreSQL**: A powerful, open-source relational database.
- **Passport**: Middleware for implementing authentication and authorization strategies.
- **Bull**: A task queue for workflow execution.
- **Redis**: A high-performance in-memory database for Bull task queues.

---

## Setup Instructions

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

3. Ensure you have the latest Node.js installed.

---

### Running the Application

#### Using Docker (Recommended)

1. Start services using Docker Compose:
   ```bash
   docker compose up --build   # For the first time
   docker compose up           # Subsequent runs
   ```

2. Access the API at [http://localhost:3000](http://localhost:3000).

#### Without Docker

1. Configure your environment variables (see below).
2. Start the application:
   ```bash
   npm run start
   ```

---

### Environment Variables

The environment variables are pre-configured in the `docker-compose.yaml` file:

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

---

## API Documentation

### Auth Endpoints

1. **Register a New User**  
   **URL:** `POST /auth/register`  
   **Body:**
   ```json
   {
     "username": "newuser",
     "password": "newpassword",
     "role": "user"
   }
   ```

2. **Login**  
   **URL:** `POST /auth/login`  
   **Body:**
   ```json
   {
     "username": "testuser",
     "password": "testpassword"
   }
   ```  
   **Response:**
   ```json
   {
     "access_token": "your.jwt.token"
   }
   ```

3. **Get Profile**  
   **URL:** `GET /auth/profile`  
   **Headers:** `Authorization: Bearer <access_token>`  

---

### User CRUD Endpoints

1. **Create a New User**  
   **URL:** `POST /users`  
   **Headers:** `Authorization: Bearer <access_token>`  
   **Body:**
   ```json
   {
     "username": "newuser",
     "password": "newpassword",
     "role": "user"
   }
   ```

2. **Get All Users**  
   **URL:** `GET /users`  
   **Headers:** `Authorization: Bearer <access_token>`  

3. **Get a User by ID**  
   **URL:** `GET /users/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  

4. **Update a User by ID**  
   **URL:** `PUT /users/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  
   **Body:**
   ```json
   {
     "username": "updateduser",
     "role": "admin"
   }
   ```

5. **Partial Update (PATCH) a User by ID**  
   **URL:** `PATCH /users/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  
   **Body:**
   ```json
   {
     "username": "updatedPartialUser"
   }
   ```

6. **Delete a User by ID**  
   **URL:** `DELETE /users/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  
   **Response:**
   ```json
   {
     "message": "User has been deleted successfully"
   }
   ```

---

### Workflow Endpoints

1. **Create a Workflow**  
   **URL:** `POST /workflows`  
   **Body:**
   ```json
   {
     "name": "My First Workflow",
     "definition": {
       "nodes": [
         {
           "id": "start_1",
           "type": "start",
           "name": "Start Node",
           "nextNode": "process_1"
         },
         {
           "id": "process_1",
           "type": "process",
           "name": "Process Node",
           "task": "processData",
           "nextNode": "end_1"
         },
         {
           "id": "end_1",
           "type": "end",
           "name": "End Node"
         }
       ]
     }
   }
   ```

2. **Execute a Workflow**  
   **URL:** `POST /workflows/execute/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  

3. **Get Workflow Details**  
   **URL:** `GET /workflows/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  

4. **List All Workflows**  
   **URL:** `GET /workflows`  
   **Headers:** `Authorization: Bearer <access_token>`  

5. **Delete a Workflow**  
   **URL:** `DELETE /workflows/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  

---

### Task Queue Endpoints

1. **Check Task Queue Status**  
   **URL:** `GET /tasks/status`  
   **Headers:** `Authorization: Bearer <access_token>`  

2. **Retry a Failed Task**  
   **URL:** `POST /tasks/retry/:id`  
   **Headers:** `Authorization: Bearer <access_token>`  

---

## Workflow Engine

### Supported Node Types

- **Start Node**: Initiates the workflow.
- **End Node**: Marks the end of the workflow.
- **Condition Node**: Evaluates a condition and branches based on the result.
- **Process Node**: Executes a predefined task.
- **Wait Node**: Pauses workflow execution for a specified time.

---

### Workflow Schema

```json
{
  "name": "My Workflow",
  "definition": {
    "nodes": [
      {
        "id": "start_1",
        "type": "start",
        "name": "Start Node",
        "nextNode": "process_1"
      },
      {
        "id": "process_1",
        "type": "process",
        "name": "Process Node",
        "task": "processData",
        "nextNode": "end_1"
      },
      {
        "id": "end_1",
        "type": "end",
        "name": "End Node"
      }
    ]
  }
}
```

---
