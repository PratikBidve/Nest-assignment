## Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
   - [Modules](#modules)
3. [Design Overview](#design-overview)
   - [Authentication and Authorization](#authentication-and-authorization)
   - [User Management](#user-management)
   - [Workflow Engine](#workflow-engine)
4. [Workflow Engine Design](#workflow-engine-design)
   - [Node Types](#node-types)
   - [Workflow Schema](#workflow-schema)
   - [State Management](#state-management)
5. [System Components](#system-components)
   - [Controllers](#controllers)
   - [Services](#services)
   - [Repositories](#repositories)
   - [Event Handling](#event-handling)
6. [Database Design](#database-design)
7. [Error Handling and Logging](#error-handling-and-logging)
8. [Future Enhancements](#future-enhancements)

---

## Introduction

This document outlines the architecture and design of the **NestJS Authentication, CRUD API, and Workflow Engine**. It provides a detailed overview of the system’s architecture, key components, and how they interact to fulfill the requirements of authentication, user management, and workflow automation.

---

## System Overview

The project is built with **NestJS**, a modular, progressive Node.js framework that helps structure applications in a highly maintainable way. The architecture includes authentication, CRUD operations for user management, and a robust workflow engine for task orchestration.

The application uses **TypeORM** for database interactions, with **PostgreSQL** as the data storage layer. **Redis** and **Bull** are integrated for background task management and workflow execution.

### Modules

The system is broken down into several core modules, each responsible for different parts of the application:

1. **Auth Module**: Handles authentication and authorization logic.
2. **User Module**: Manages CRUD operations for user entities.
3. **Workflow Module**: Contains logic for creating and executing workflows.
4. **Task Queue Module**: Manages asynchronous task execution using **Bull**.
5. **Events Module**: WebSocket gateway to emit workflow updates to clients.
6. **Audit Module**: Tracks actions for auditing purposes.

---

## Design Overview

### Authentication and Authorization

The system provides a **JWT-based authentication** mechanism to authenticate users. The **auth module** includes:

- **Local Strategy**: For verifying username/password.
- **JWT Strategy**: To verify access tokens.
- **Guards**: Including role-based guards to restrict access based on user roles.
- **Decorators**: Custom decorators to mark routes as public or require specific roles.

### User Management

The **User Module** allows for managing users with full **CRUD** capabilities. The user endpoints are secured, requiring valid tokens to perform operations. Users have roles that define their level of access (e.g., `user`, `admin`).

### Workflow Engine

The **Workflow Module** provides a framework for creating, updating, and executing workflows with various nodes. A workflow consists of multiple **nodes**, each of which has a specific type (`start`, `condition`, `wait`, `end`).

The **Workflow Service** and **Workflow Processor** are responsible for managing workflow lifecycle and execution logic. Workflows can be executed asynchronously using a task queue, which ensures scalability.

---

## Workflow Engine Design

The workflow engine is the core component of this application, allowing users to design and execute workflows that consist of nodes representing different actions or decisions.

### Node Types

1. **Start**: The entry point of the workflow. Each workflow must have a single `start` node.
2. **Condition**: Evaluates a condition to determine which branch to take.
3. **Wait**: Adds a delay before continuing to the next node.
4. **End**: Terminates the workflow.

### Workflow Schema

- **Workflow Entity**: Stores the definition of the workflow, including its name, description, and status.
- **Node Entity**: Represents each node in a workflow, storing information like type, configuration, and the ID of the next node.

Each workflow is represented by a JSON schema that includes a list of nodes and the connections between them. This schema is validated when a workflow is created or updated.

### State Management

The workflow state is tracked using the **Execution State Entity**, which maintains the current node, workflow ID, and other metadata related to execution. This allows the engine to pause, resume, or retry workflows as needed.

- **Execution State Table**: Keeps track of each workflow's progress.
- **State Transitions**: Handled by the **Workflow Processor**, which updates the state as nodes are processed.

---

## System Components

### Controllers

**Controllers** define the API endpoints and act as a bridge between user requests and business logic. Major controllers in this project:

- **Auth Controller**: Handles user registration, login, and profile operations.
- **Users Controller**: Manages user CRUD operations.
- **Workflows Controller**: Manages workflow creation, updates, and retrieval.
  
### Services

**Services** contain the business logic. Key services:

- **Auth Service**: Handles the logic for authentication and authorization.
- **User Service**: Manages user-related operations.
- **Workflow Service**: Responsible for creating, updating, and retrieving workflows.
- **Node Service**: Handles node creation and configuration.

### Repositories

**Repositories** use **TypeORM** to interact with the database. Each entity (User, Workflow, Node, etc.) has a corresponding repository.

- **Workflow Repository**: Manages workflows and their related nodes.
- **Node Repository**: Handles persistence for workflow nodes.

### Event Handling

The **Events Module** uses **WebSockets** to notify clients of updates to workflows. This is useful for monitoring long-running workflows.

- **Events Gateway**: Sends notifications to subscribed clients.
- **Workflow Events**: Emitted whenever a workflow’s state changes (e.g., `started`, `completed`, `failed`).

---

## Database Design

The database uses **PostgreSQL** with **TypeORM** entities:

1. **User Entity**: Represents application users, storing details like username, password, and role.
2. **Workflow Entity**: Represents a workflow, storing its name, description, status, and metadata.
3. **Node Entity**: Represents nodes within a workflow, storing configuration data and relationships to other nodes.
4. **Execution State Entity**: Stores the current state of a running workflow.
5. **Audit Entity**: Stores information for auditing purposes, such as user actions.

### Entity Relationships

- **Workflow - Nodes**: A **one-to-many** relationship. Each workflow contains multiple nodes.
- **Node - Execution State**: Nodes are linked to their execution state, which is updated during runtime.

---

## Error Handling and Logging

### Error Handling

Errors are managed centrally using **NestJS filters** to catch unhandled exceptions and provide appropriate HTTP responses. The **HttpExceptionFilter** is used to format error responses consistently.

### Logging

The application includes a **custom Logger Service** for consistent logging. All critical actions, including workflow executions and authentication events, are logged.

- **Error Logs**: Errors are logged with stack traces.
- **Audit Logs**: User activities are logged to track modifications to workflows and entities.
