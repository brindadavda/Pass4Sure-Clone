**Pass4Sure** – Exam preparation and practice platform built with React, Node.js, Express, and PostgreSQL.

### Features

- Browse exams and practice questions
- Submit practice responses with immediate feedback
- User dashboard and analytics
- Admin panel for managing exams and questions
- Secure authentication with JWT

### Tech Stack

- Frontend: React, TailwindCSS, React Router DOM, Axios
- Backend: Node.js, Express, PostgreSQL
- Authentication: JWT

### Setup

1. Clone the repository:

```bash
git clone git@github.com:brindadavda/Pass4Sure-Clone.git
cd Pass4Sure-Clone
  ```

## Install server depednacy:
  ```bash
   cd server
   npm install
  ```

## Install client depednacy:
 ```bash
cd ../client
npm install
  ```

## Create DB:
 ```bash
CREATE DATABASE pass4sure;
  ```

## Apply the exstining db:
 ```bash
psql -U enpointe -d pass4sure -h localhost -p 5432 -f db/schema.sql
  ```

## Verify tables
 ```bash
\c pass4sure
\dt
  ```

## Run the app
## Backend:
 ```bash
cd server
npm run dev
  ```

## Fronetned: 
 ```bash
cd client
npm run dev
  ```




=======
# Pass4Sure-Clone

Full-stack scaffold for a Pass4Sure-style certification practice platform.

## Project structure

- `server/` - Node.js + Express API (PostgreSQL)
- `client/` - React + Vite + TailwindCSS web app

## Getting started

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Import the schema into PostgreSQL:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Update `VITE_API_URL` in a `.env` file inside `client/` if your API runs elsewhere.
>>>>>>> 2b20679 (added db connection)
