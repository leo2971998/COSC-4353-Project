# COSC-4353 Project

This repository contains a React frontend (`/client`) and an Express backend (`/server`).

## Backend setup

1. Install dependencies:
   ```sh
   cd server
   npm install
   ```
2. Copy `.env.example` to `.env` and update the values to match your MySQL instance.
3. Start the server in development mode:
   ```sh
   npm run dev
   ```

The server uses the following environment variables:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `PORT` (optional, defaults to `3000`)

## Frontend setup

1. Install dependencies:
   ```sh
   cd client
   npm install
   ```
2. Copy `.env.example` to `.env` and update `VITE_API_URL` to point to the backend server. For the deployed backend use `https://cosc-4353-backend.vercel.app`.
3. Start the development server:
   ```sh
   npm run dev
   ```

The frontend reads `VITE_API_URL` when calling the `/register` and `/login` routes.

## Deploying the backend to Vercel

1. Push this repository to GitHub and import it in [Vercel](https://vercel.com/new).
2. Set the project root to the `server` directory so that Vercel installs dependencies and runs `npm start`.
3. In the Vercel project settings, add the environment variables listed above under **Environment Variables**.
4. Deploy the project. Vercel will automatically install dependencies and start your Express server.

Make sure your database is accessible from Vercel and that the credentials are correct.

## Deploying the frontend to Vercel

1. Push the contents of the `client` directory to a separate repository or configure a new Vercel project pointing to it.
2. In the Vercel project settings, add `VITE_API_URL` with the value `https://cosc-4353-backend.vercel.app`.
3. Deploy the project and Vercel will build the React app.
