
# NestJS Authentication and CRUD API

This project is a RESTful API built with NestJS, TypeORM, and PostgreSQL. It provides user authentication with JWT, role-based authorization, and secure CRUD operations on a User resource. The API adheres to clean and modular architecture principles, facilitating code reusability and scalability.

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
5. [Project Structure](#project-structure)  

---

## Project Overview

### Key Features

- **User Registration and Login**: Users can register and log in using JWT-based authentication.
- **Role-Based Authorization**: Implement roles (admin, user) to restrict access to specific routes.
- **User CRUD Operations**: Secure CRUD operations on the User entity with authentication.
- **Modular Architecture**: Uses NestJS modules for separation of concerns, ensuring maintainability and scalability.

---

## Tech Stack

- **NestJS**: A progressive Node.js framework for scalable server-side applications.
- **TypeORM**: An ORM for interacting with PostgreSQL for efficient database management.
- **PostgreSQL**: A powerful, open-source relational database.
- **Passport**: Middleware for implementing authentication and authorization strategies.

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

## Project Structure

```
src/
├── auth/                              # Authentication and Authorization
│   ├── decorators/
│   │   └── public.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   ├── auth.controller.spec.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.spec.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── local.strategy.ts
├── users/                             # User Management
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── user.entity.ts
│   ├── users.controller.spec.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   ├── users.service.spec.ts
│   └── users.service.ts
├── workflows/                         # Workflow Management
│   ├── dto/
│   │   ├── create-workflow.dto.ts
│   │   └── create-node.dto.ts
│   ├── entities/
│   │   ├── workflow.entity.ts
│   │   └── node.entity.ts
│   ├── services/
│   │   ├── workflow.service.ts
│   │   └── node.service.ts
│   ├── workflows.controller.ts
│   └── workflows.module.ts
├── task-queue/                        # Task Queue for Workflow Execution
│   ├── task-queue.module.ts
│   └── workflow.processor.ts
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts

```

---

## License

This project is licensed under the [MIT License](LICENSE).  

--- 

Enjoy coding with NestJS! 🚀
