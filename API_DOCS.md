## Table of Contents

1. [Introduction](#introduction)
2. [Authentication API](#authentication-api)
   - [Register User](#register-user)
   - [Login](#login)
   - [Get Profile](#get-profile)
3. [User Management API](#user-management-api)
   - [Create User](#create-user)
   - [Get All Users](#get-all-users)
   - [Get User by ID](#get-user-by-id)
   - [Update User by ID](#update-user-by-id)
   - [Patch User by ID](#patch-user-by-id)
   - [Delete User by ID](#delete-user-by-id)
4. [Workflow Engine API](#workflow-engine-api)
   - [Create Workflow](#create-workflow)
   - [Update Workflow](#update-workflow)
   - [Retrieve Workflow by ID](#retrieve-workflow-by-id)
   - [Retrieve All Workflows](#retrieve-all-workflows)
   - [Delete Workflow](#delete-workflow)
5. [Health Check API](#health-check-api)
6. [Swagger Documentation](#swagger-documentation)

---

## Introduction

The **NestJS Authentication, CRUD API, and Workflow Engine** exposes various RESTful endpoints for user management, authentication, and workflow automation. Each endpoint is secured using **JWT-based authentication** to ensure secure access. This document provides the specifications for each API, including the expected request body, validation rules, response formats, and error messages.

The APIs are designed to provide a smooth and secure experience for user and workflow management with features like input validation, role-based authorization, and precise error messages for incorrect requests.

---

## Authentication API

### Register User

**Endpoint**: `/auth/register`  
**Method**: `POST`  
**Description**: Registers a new user with validation to ensure a secure and consistent user database.

**Request Body**:
```json
{
  "username": "newuser123",
  "password": "Password@123",
  "role": "user"
}
```
**Validations**:
- **username**: Must be a string between 4 and 20 characters long.
- **password**: Must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
- **role** (optional): Must be either `admin` or `user`.

**Response**:
- `201 Created`
  ```json
  {
    "id": 1,
    "username": "newuser123",
    "role": "user"
  }
  ```
  
**Error Responses**:
- `400 Bad Request`: Validation errors.
  ```json
  {
    "statusCode": 400,
    "message": [
      "Username must be between 4 to 20 characters.",
      "Password must be between 8 and 20 characters."
    ],
    "error": "Bad Request"
  }
  ```

### Login

**Endpoint**: `/auth/login`  
**Method**: `POST`  
**Description**: Authenticates a user and provides a JWT token.

**Request Body**:
```json
{
  "username": "newuser123",
  "password": "Password@123"
}
```
**Response**:
- `200 OK`
  ```json
  {
    "access_token": "your.jwt.token"
  }
  ```

### Get Profile

**Endpoint**: `/auth/profile`  
**Method**: `GET`  
**Description**: Retrieves the profile of the authenticated user.

**Headers**:
- `Authorization: Bearer <access_token>`

**Response**:
- `200 OK`
  ```json
  {
    "id": 1,
    "username": "newuser123",
    "role": "user"
  }
  ```

---

## User Management API

### Create User

**Endpoint**: `/users`  
**Method**: `POST`  
**Description**: Creates a new user. Requires admin role.

**Headers**:
- `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "username": "newadmin",
  "password": "Admin@1234",
  "role": "admin"
}
```
**Validations**:
- **username**: Must be between 4 and 20 characters.
- **password**: Must be between 8 and 20 characters, containing at least one uppercase letter, one lowercase letter, one number, and one special character.
- **role**: Must be either `admin` or `user`.

**Response**:
- `201 Created`
  ```json
  {
    "id": 2,
    "username": "newadmin",
    "role": "admin"
  }
  ```

### Get All Users

**Endpoint**: `/users`  
**Method**: `GET`  
**Description**: Retrieves a list of all users. Requires admin role.

**Headers**:
- `Authorization: Bearer <access_token>`

**Response**:
- `200 OK`
  ```json
  [
    {
      "id": 1,
      "username": "adminuser",
      "role": "admin"
    },
    {
      "id": 2,
      "username": "newuser123",
      "role": "user"
    }
  ]
  ```

---

## Workflow Engine API

### Create Workflow

**Endpoint**: `/workflows`  
**Method**: `POST`  
**Description**: Creates a new workflow consisting of nodes such as `start`, `end`, `condition`, and `wait`.

**Request Body**:
```json
{
  "name": "Sample Workflow",
  "definition": {
    "description": "A sample workflow that demonstrates different node types."
  },
  "nodes": [
    {
      "type": "start",
      "name": "Start Node",
      "configuration": {
        "info": "This is the entry point of the workflow."
      },
      "nextNodeId": 2
    },
    {
      "type": "condition",
      "name": "Check Condition",
      "configuration": {
        "info": "Evaluates a condition to decide the next node.",
        "condition": "Math.random() > 0.5"
      },
      "nextNodeId": null
    },
    {
      "type": "wait",
      "name": "Wait Node",
      "configuration": {
        "info": "Pauses workflow execution for a set duration.",
        "waitDuration": 5000
      },
      "nextNodeId": 4
    },
    {
      "type": "end",
      "name": "End Node",
      "configuration": {
        "info": "Marks the completion of the workflow."
      },
      "nextNodeId": null
    }
  ]
}

```
**Validations**:
- **name**: Must not be empty.
- **definition**: Must be a valid object.
- **nodes** (optional): Must be an array of nodes, each with:
  - **type**: Must be `start`, `end`, `condition`, or `wait`.
  - **name** (optional): Must be a string.
  - **configuration** (optional): Must be a valid object.
  - **nextNodeId** (optional): Must be a number.

**Response**:
- `201 Created`
  ```json
  {
  "name": "Sample Workflow",
  "definition": {
    "description": "A sample workflow that demonstrates different node types."
  },
  "id": 2,
  "status": "active",
  "createdAt": "2024-11-29T10:57:36.132Z",
  "updatedAt": "2024-11-29T10:57:36.132Z",
  "deletedAt": null
}
  ```

### Update Workflow

**Endpoint**: `/workflows/{id}`  
**Method**: `PUT`  
**Description**: Updates an existing workflow.

**Request Body**:

```json

  {
    "name": "Sample Workflow3",
    "definition": {
      "description": "A sample workflow that demonstrates different node types."
    },
    "nodes": [
      {
        "type": "start",
        "name": "Start Node",
        "configuration": {
          "info": "This is the entry point of the workflow."
        },
        "nextNodeId": 2
      },
      {
        "type": "condition",
        "name": "Check Condition",
        "configuration": {
          "info": "Evaluates a condition to decide the next node.",
          "condition": "Math.random() > 0.5"
        },
        "nextNodeId": null
      },
      {
        "type": "wait",
        "name": "Wait Node",
        "configuration": {
          "info": "Pauses workflow execution for a set duration.",
          "waitDuration": 5000
        },
        "nextNodeId": 4
      },
      {
        "type": "end",
        "name": "End Node",
        "configuration": {
          "info": "Marks the completion of the workflow."
        },
        "nextNodeId": null
      }
    ]
  }
  
  ```
**Validations**:
- Same as [Create Workflow](#create-workflow).

**Response**:
- `200 OK`
  ```json
  {
  "id": 2,
  "name": "Sample Workflow3",
  "definition": {
    "description": "A sample workflow that demonstrates different node types."
  },
  "status": "active",
  "createdAt": "2024-11-29T10:57:36.132Z",
  "updatedAt": "2024-11-29T10:58:19.258Z",
  "deletedAt": null,
  "nodes": [
    {
      "type": "start",
      "name": "Start Node",
      "configuration": {
        "info": "This is the entry point of the workflow."
      },
      "nextNodeId": 2,
      "id": 21,
      "createdAt": "2024-11-29T10:58:19.258Z",
      "updatedAt": "2024-11-29T10:58:19.258Z",
      "deletedAt": null
    },
    {
      "type": "condition",
      "name": "Check Condition",
      "configuration": {
        "info": "Evaluates a condition to decide the next node.",
        "condition": "Math.random() > 0.5"
      },
      "nextNodeId": null,
      "id": 22,
      "createdAt": "2024-11-29T10:58:19.258Z",
      "updatedAt": "2024-11-29T10:58:19.258Z",
      "deletedAt": null
    },
    {
      "type": "wait",
      "name": "Wait Node",
      "configuration": {
        "info": "Pauses workflow execution for a set duration.",
        "waitDuration": 5000
      },
      "nextNodeId": 4,
      "id": 23,
      "createdAt": "2024-11-29T10:58:19.258Z",
      "updatedAt": "2024-11-29T10:58:19.258Z",
      "deletedAt": null
    },
    {
      "type": "end",
      "name": "End Node",
      "configuration": {
        "info": "Marks the completion of the workflow."
      },
      "nextNodeId": null,
      "id": 24,
      "createdAt": "2024-11-29T10:58:19.258Z",
      "updatedAt": "2024-11-29T10:58:19.258Z",
      "deletedAt": null
    }
  ]
}
  ```

### Retrieve Workflow by ID

**Endpoint**: `/workflows/{id}`  
**Method**: `GET`  
**Description**: Retrieves a workflow by ID.

**Response**:
- `200 OK`
  ```json
  {
  "id": 2,
  "name": "Sample Workflow",
  "definition": {
    "description": "A sample workflow that demonstrates different node types."
  },
  "status": "active",
  "createdAt": "2024-11-29T10:57:36.132Z",
  "updatedAt": "2024-11-29T10:57:36.132Z",
  "deletedAt": null,
  "nodes": [
    {
      "id": 13,
      "type": "start",
      "name": "Start Node",
      "configuration": {
        "info": "This is the entry point of the workflow."
      },
      "nextNodeId": 2,
      "createdAt": "2024-11-29T10:57:36.140Z",
      "updatedAt": "2024-11-29T10:57:36.140Z",
      "deletedAt": null
    },
    {
      "id": 14,
      "type": "condition",
      "name": "Check Condition",
      "configuration": {
        "info": "Evaluates a condition to decide the next node.",
        "condition": "Math.random() > 0.5"
      },
      "nextNodeId": null,
      "createdAt": "2024-11-29T10:57:36.140Z",
      "updatedAt": "2024-11-29T10:57:36.140Z",
      "deletedAt": null
    },
    {
      "id": 15,
      "type": "wait",
      "name": "Wait Node",
      "configuration": {
        "info": "Pauses workflow execution for a set duration.",
        "waitDuration": 5000
      },
      "nextNodeId": 4,
      "createdAt": "2024-11-29T10:57:36.140Z",
      "updatedAt": "2024-11-29T10:57:36.140Z",
      "deletedAt": null
    },
    {
      "id": 16,
      "type": "end",
      "name": "End Node",
      "configuration": {
        "info": "Marks the completion of the workflow."
      },
      "nextNodeId": null,
      "createdAt": "2024-11-29T10:57:36.140Z",
      "updatedAt": "2024-11-29T10:57:36.140Z",
      "deletedAt": null
    }
  ]
}
  ```

### Delete Workflow

**Endpoint**: `/workflows/{id}`  
**Method**: `DELETE`  
**Description**: Deletes a workflow by ID.

**Response**:
- `200 OK`
  ```json
  {
    "message": "Workflow with ID 3 has been deleted successfully."
  }
  ```

---

## Health Check API

**Endpoint**: `/health`  
**Method**: `GET`  
**Description**: Provides a health check for the API.

**Response**:
- `200 OK`
  ```json
  {
    "status": "ok"
  }
  ```

---

## Swagger Documentation

The project uses **Swagger** for API documentation. Swagger provides an interactive interface to test and understand all API endpoints.

- **URL**: `/api`  
  Access the Swagger UI to interact with the APIs and view detailed documentation for each endpoint.

**Note**: Swagger includes detailed examples, request/response formats, and descriptions for each endpoint, making it easier to explore and understand the API.
