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
