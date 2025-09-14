# Backend for Peradeniya EngEx Scan

## Setup (local, non-docker)
1. Create .env from .env.example and set DATABASE_URL to your Postgres.
2. Run migrations:
   psql <DATABASE_URL> -f migrations/001_init.sql
   (or use pgadmin/psql to run the SQL)
3. Install deps:
   cd backend
   npm install
4. Start server:
   npm run dev
   Server runs at http://localhost:4000

## API endpoints
- GET  /api/health
- GET  /api/buildings            -> list buildings
- POST /api/scan                 -> save scan (body: qr_value, building_id, action, scanned_by?)
- GET  /api/people-inside        -> returns list [{building_id, building_name, people_inside}]

## Example curl
Insert a scan:
