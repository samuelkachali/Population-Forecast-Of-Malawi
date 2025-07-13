# Population Forecast Of Malawi

A full-stack web application for forecasting and analyzing the population trends of Malawi, featuring interactive dashboards, analytics, and report generation.

## Features
- User authentication and role-based access (admin/user)
- Interactive dashboard with population, age, regional, and health analytics
- Comparative studies and historical trends
- Report generation and download (PDF, CSV)
- Cloud-hosted backend and database
- Responsive, modern UI

## Tech Stack
- **Frontend:** React, Material-UI
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon/Supabase/Render)
- **Deployment:** Vercel (frontend), Render (backend), Neon/Supabase (database)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/population-forecast-of-malawi.git
cd population-forecast-of-malawi
```

### 2. Setup the Backend
```bash
cd server
npm install
```

#### Create a `.env` file in the `server/` directory:
```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
```

#### Start the backend locally:
```bash
npm start
```

### 3. Setup the Frontend
```bash
cd ../
npm install
```

#### Create a `.env` file in the root directory:
```
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com
```

#### Start the frontend locally:
```bash
npm start
```

### 4. Database Setup
- Use the provided SQL scripts or ORM migrations to create the required tables (see `/server/db.js` for schema).
- You can use free cloud PostgreSQL providers like [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).

## Deployment

### Frontend (Vercel)
- Connect your GitHub repo to Vercel.
- Set the environment variable `REACT_APP_API_BASE_URL` to your backend's public URL.
- Deploy from the Vercel dashboard.

### Backend (Render)
- Connect your GitHub repo to Render.
- Set the environment variables for your database and JWT secret.
- Deploy from the Render dashboard.

### Database (Neon/Supabase)
- Create a new project and database.
- Update your backend `.env` with the new connection string.

## Environment Variables

### Backend (`server/.env`)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for JWT authentication

### Frontend (`.env`)
- `REACT_APP_API_BASE_URL` — URL of your backend API

## Troubleshooting
- **API requests going to the wrong domain:** Ensure `REACT_APP_API_BASE_URL` is set before building/deploying the frontend, and redeploy after changes.
- **CORS errors:** Make sure your backend CORS settings allow requests from your frontend domain.
- **Database connection issues:** Double-check your connection string and that your database is accessible from the backend host.
- **Environment variables not picked up:** Always redeploy after changing environment variables in Vercel or Render.

## License
MIT
