NestJS Authentication and CRUD API:
This project is a RESTful API built with NestJS, TypeORM, and PostgreSQL. It provides user authentication with JWT, role-based authorization, and secure CRUD operations on a User resource. The API adheres to clean and modular architecture principles, facilitating code reusability and scalability.

Table of Contents:
1)Project Overview
2)Tech Stack
3)Setup Instructions
4)Installation
5)Running the Application
6)Environment Variables
7)API Documentation
8)Auth Endpoints
9)User CRUD Endpoints
10)Project Structure

Project Overview:
The API’s main functionalities include:

User Registration and Login: Users can register and log in using JWT-based authentication.
Role-Based Authorization: Implemented roles (admin, user) to restrict access to specific routes based on user roles.
User CRUD Operations: Users can perform CRUD operations on the User entity, with routes secured by authentication.
Modular Architecture: Uses NestJS modules (AuthModule, UsersModule) for separation of concerns, making the API maintainable and scalable.
Tech Stack:
NestJS: A progressive Node.js framework for scalable server-side applications.
TypeORM: An ORM that allows interaction with PostgreSQL for efficient database management.
PostgreSQL: A robust and widely used relational database system.
Passport: Middleware for implementing authentication and authorization strategies.
Setup Instructions
Installation
Clone the repository:

git clone https://github.com/PratikBidve/Nest-assignment.git

cd Nest-assignment

Note: Make sure you installed the latest Nodejs on your computer.
Install dependencies(Inside terminal):

npm install

We have the enviorment variables inside docker-compose.yaml:
    environment:
      - DB_TYPE=postgres
      - PG_HOST=db
      - PG_USER=postgres
      - PG_PASSWORD=postgres
      - PG_DB=postgres
      - PG_PORT=5432
      - JWT_SECRET=your_jwt_secret_key 

Running the Application
Run with Docker (Recommended)

Start services using Docker Compose:

docker compose up --build       //for the first time 
docker compose up               //after first time 

This will start the NestJS API, PostgreSQL, and PgAdmin for database management.

Access the API at http://localhost:3000.


# Database configuration
DB_TYPE=postgres
PG_HOST=db
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB=postgres

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key


API Documentation:
Auth Endpoints
Register a New User
URL: POST /auth/register

Description: Registers a new user with a username, password, and optional role.

Body:

json:
Copy code:
{
  "username": "newuser",
  "password": "newpassword",
  "role": "user"
}
Login:
URL: POST /auth/login

Description: Authenticates a user and provides a JWT access token.

Body:

json
Copy code
{
  "username": "testuser",
  "password": "testpassword"
}
Response:

json
Copy code
{
  "access_token": "your.jwt.token"
}
Get Profile
URL: GET /auth/profile
Description: Returns the logged-in user’s profile.
Headers: Authorization: Bearer <access_token>
User CRUD Endpoints
These endpoints allow for creating, reading, updating, and deleting users. All endpoints are protected and require a valid JWT token.

Create a New User
URL: POST /users

Description: Creates a new user.

Headers: Authorization: Bearer <access_token>

Body:

json
Copy code
{
  "username": "newuser",
  "password": "newpassword",
  "role": "user"
}
Get All Users

URL: GET /users

Description: Retrieves a list of all users.
Headers: Authorization: Bearer <access_token>

Get a User by ID
URL: GET /users/:id
Description: Retrieves a specific user by their ID.
Headers: Authorization: Bearer <access_token>

Update a User by ID
URL: PUT /users/:id

Description: Updates a user’s details.

Headers: Authorization: Bearer <access_token>

Body:

json:
Copy code
{
  "username": "updateduser",
  "role": "admin"
}


Partial Update (PATCH) a User by ID
URL: PATCH /users/:id

Description: Updates specific fields of a user’s profile.

Headers: Authorization: Bearer <access_token>

Body:

json:
Copy code
{
  "username": "updatedPartialUser"
}


Delete a User by ID
URL: DELETE /users/:id

Description: Deletes a user by their ID.

Headers: Authorization: Bearer <access_token>

Response:

json
Copy code
{
  "message": "User has been deleted successfully"
}


Project Structure:
src/
├── auth/
│   ├── decorators/
│   │   └── public.decorator.ts          # Decorator for marking public routes
│   ├── guards/
│   │   ├── jwt-auth.guard.ts            # JWT guard for protecting routes
│   │   └── local-auth.guard.ts          # Local guard for handling login
│   ├── auth.controller.spec.ts          # Unit tests for AuthController
│   ├── auth.controller.ts               # Authentication controller
│   ├── auth.module.ts                   # Authentication module
│   ├── auth.service.spec.ts             # Unit tests for AuthService
│   ├── auth.service.ts                  # Authentication service
│   ├── jwt.strategy.ts                  # JWT strategy for authorization
│   └── local.strategy.ts                # Local strategy for login
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts           # DTO for user creation
│   ├── user.entity.ts                   # User entity definition
│   ├── users.controller.spec.ts         # Unit tests for UsersController
│   ├── users.controller.ts              # User controller for CRUD operations
│   ├── users.module.ts                  # User module
│   ├── users.service.spec.ts            # Unit tests for UsersService
│   └── users.service.ts                 # User service for database operations
├── app.controller.spec.ts               # Unit tests for AppController
├── app.controller.ts                    # Main application controller
├── app.module.ts                        # Root module of the application
├── app.service.ts                       # Main application service
└── main.ts                              # Application entry point


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
