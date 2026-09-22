# Online Voting System

A full-stack web application for conducting online elections with secure authentication, election management, candidate management, vote validation, and election result visualization.

## Features

* User registration and login
* JWT-based authentication
* Role-based admin authorization
* Election creation, updating, viewing, and deletion
* Candidate management
* One vote per user per election
* Election status and date validation
* Secure vote submission
* Database transactions for vote casting
* Election result calculation
* Candidate vote-count visualization
* Responsive frontend
* RESTful backend APIs

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Chart.js

### Backend

* Node.js
* Express.js
* JWT
* bcryptjs
* mysql2
* CORS

### Database

* MySQL
* MySQL-compatible cloud database for deployment

## Project Structure

```text
online-voting-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
│
└── README.md
```

## Database Design

The system uses the following main tables:

* `users`
* `elections`
* `candidates`
* `votes`

The `votes` table uses a composite unique constraint on:

```sql
UNIQUE (user_id, election_id)
```

This prevents a user from voting more than once in the same election.

## Authentication

After login, the backend generates a JWT containing the authenticated user's identity and role.

Protected requests send:

```http
Authorization: Bearer <token>
```

The backend verifies the token before allowing access to protected resources.

## Voting Security

The application implements multiple layers of validation:

1. JWT authentication
2. Role-based authorization where required
3. Election existence validation
4. Election status validation
5. Voting date validation
6. Candidate-election relationship validation
7. Duplicate-vote protection
8. Database transaction handling

The backend derives the voter identity from the authenticated JWT instead of trusting a `user_id` supplied by the client.

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Elections

```text
GET    /api/elections
GET    /api/elections/:id
POST   /api/elections
PUT    /api/elections/:id
DELETE /api/elections/:id
```

### Candidates

```text
POST   /api/candidates
GET    /api/candidates
GET    /api/candidates/election/:electionId
PUT    /api/candidates/:id
DELETE /api/candidates/:id
```

### Voting

```text
POST /api/votes
GET  /api/votes/my-votes
```

### Results

```text
GET /api/results/election/:electionId
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/RiteshKumar-codes/online-voting-system.git
cd online-voting-system
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Create environment variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
JWT_SECRET=

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=voting_system
DB_SSL=false

FRONTEND_URL=http://127.0.0.1:5500
```

### 4. Create the database

Create a MySQL database named:

```sql
CREATE DATABASE voting_system;
```

Then execute the SQL in:

```text
database/schema.sql
```

### 5. Start the backend

```bash
npm run dev
```

The API runs locally on:

```text
http://localhost:5000
```

### 6. Start the frontend

Open the `frontend` directory using a local static server such as VS Code Live Server.

## Deployment

The application can be deployed using:

```text
Frontend → Static hosting
Backend  → Node.js web service
Database → Cloud MySQL-compatible database
```

Production secrets should be configured using environment variables rather than committed to the repository.

## Future Improvements

* Admin dashboard
* Email notifications
* Password reset
* HttpOnly secure cookie authentication
* Rate limiting improvements
* Audit logging
* More advanced result analytics
* Automated tests
* CI/CD pipeline
* Better accessibility
* Production-grade monitoring

## Author

Ritesh Kumar

GitHub:
https://github.com/RiteshKumar-codes

## Screenshots

### Dashboard

(docs/dashboard.png)

### Voting

(docs/voting.png)

### Results

(docs/results.png)

### login

(docs/login.png)

### home

(docs/home.png)