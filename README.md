# Task Manager API

A REST API for managing projects and tasks, built with Node.js, Express, PostgreSQL, and Prisma. Includes JWT-based authentication.

## Tech Stack
- Node.js + Express
- PostgreSQL (via Prisma ORM)
- JWT authentication (jsonwebtoken + bcryptjs)

## Setup (from scratch)

### 1. Install Node.js
Download and install from [nodejs.org](https://nodejs.org/) (LTS version). Verify with:
```bash
node -v
npm -v
```

### 2. Get a PostgreSQL database
Easiest option for a fresh start — use a free hosted Postgres instead of installing it locally:
- [Neon](https://neon.tech) or [Supabase](https://supabase.com) — both have a free tier, sign up and create a project, then copy the connection string they give you.

### 3. Install project dependencies
```bash
cd task-manager-api
npm install
```

### 4. Configure environment variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```
- `DATABASE_URL`: paste the connection string from Neon/Supabase
- `JWT_SECRET`: any long random string (e.g. generate one with `openssl rand -base64 32`)

### 5. Set up the database
```bash
npx prisma generate
npx prisma migrate dev --name init
```
This creates the `User`, `Project`, and `Task` tables in your database.

### 6. Run the server
```bash
npm run dev
```
Server runs at `http://localhost:3000`.

## API Endpoints

### Auth
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ email, password, name }` | Create a new user, returns JWT |
| POST | `/api/auth/login` | `{ email, password }` | Log in, returns JWT |

All routes below require header: `Authorization: Bearer <token>`

### Projects
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/projects` | `{ name, description }` | Create a project |
| GET | `/api/projects` | — | List your projects (with tasks) |
| GET | `/api/projects/:id` | — | Get one project |
| PUT | `/api/projects/:id` | `{ name, description }` | Update a project |
| DELETE | `/api/projects/:id` | — | Delete a project (and its tasks) |

### Tasks
| Method | Route | Body / Query | Description |
|---|---|---|---|
| POST | `/api/tasks` | `{ title, description, status, priority, dueDate, projectId }` | Create a task |
| GET | `/api/tasks` | `?status=&priority=&projectId=` | List your tasks, filterable |
| GET | `/api/tasks/:id` | — | Get one task |
| PUT | `/api/tasks/:id` | any of the above fields | Update a task |
| DELETE | `/api/tasks/:id` | — | Delete a task |

`status`: `TODO` \| `IN_PROGRESS` \| `DONE`
`priority`: `LOW` \| `MEDIUM` \| `HIGH`

## Example: quick test with curl
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"pass123","name":"Lakky"}'

# Use the returned token for authenticated requests
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"name":"My First Project","description":"Testing the API"}'
```

## Deployment
Deploy free on [Railway](https://railway.app) or [Render](https://render.com):
1. Push this repo to GitHub
2. Connect the repo on Railway/Render
3. Add the same environment variables (`DATABASE_URL`, `JWT_SECRET`)
4. Deploy — it will run `npm start`

## Future improvements
- Input validation (Zod)
- Automated tests (Jest + Supertest)
- Pagination on list endpoints
