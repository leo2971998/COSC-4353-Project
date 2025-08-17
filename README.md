# COSC-4353 Project Frontend

This repository contains the React front-end for the COSC-4353 project. The backend API is hosted separately at `https://cosc-4353-backend.vercel.app`.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
   The root `package.json` installs the client dependencies automatically.
2. Copy `.env.example` to `.env` inside `client` and adjust `VITE_API_URL` if needed.
3. Start the development server:
   ```sh
   npm run dev
   ```

## Build

Run `npm run build` to create the production-ready files in `client/dist/`.

## Deployment

The included `vercel.json` file tells Vercel to run `npm run build` and serve the output from `client/dist`.
