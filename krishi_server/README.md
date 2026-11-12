# Krishi Mama — Server

Backend for Krishi Mama. **Node.js + Express + MongoDB (Mongoose).**

This is a fresh scaffold. The client's NASA POWER logic still runs inside
`krishi_client/src/app/api/handoff/route.js`; moving it here is future work.

## Run locally

```bash
npm install
cp .env.example .env      # then edit the values
npm run dev               # http://localhost:5000
```

Without `MONGODB_URI` the server still starts, but the health endpoint reports
`database: "disconnected"`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Service name and status |
| GET | `/api/health` | Uptime, MongoDB connection state, timestamp |

## Layout

```
src/index.js         app entry: express app, middleware, error handling
src/config/db.js     Mongoose connection helper
src/routes/health.js /api/health route
.env.example         copy to .env
```
