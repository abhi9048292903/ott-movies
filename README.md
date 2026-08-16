# OTT Finder (frontend)

React UI for browsing where a movie is streaming, and (when that is unknown) a predicted OTT date. Admins sign in to add and edit titles.

This app talks only to the API. It does not connect to the database.

## Stack

- React 19 + TypeScript
- Vite
- MUI
- React Router

## What you can do

| Route | Who | Purpose |
|---|---|---|
| `/` | Anyone | Search and filter the catalog |
| `/movie/:id` | Anyone | Title detail, platforms, announced or predicted OTT date |
| `/login` | Admin | Sign in |
| `/admin/movies` | Admin | List titles |
| `/admin/movies/new` | Admin | Create a title |
| `/admin/movies/:id/edit` | Admin | Update a title |

## Prerequisites

- Node.js 18+
- The API running at `http://127.0.0.1:8000` (see `ott-movies-be`)

## Start locally

From this folder:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Default admin (from the API `.env`): `admin@ott.local` / `admin123`

## How it talks to the API

In development, the UI calls `/api/...`. Vite proxies that to FastAPI and strips the `/api` prefix:

```
browser → http://localhost:5173/api/movies
       → http://127.0.0.1:8000/movies
```

That proxy is only for `npm run dev`. A production build needs a real API URL.

Auth: after login, a JWT is stored in `localStorage` as `ott_token` and sent as `Authorization: Bearer ...` on admin writes.

## Scripts

```bash
npm run dev      # local UI
npm run build    # production bundle
npm run preview  # serve the bundle
npm run lint     # ESLint
```

## Project layout

```
src/
  api.ts                 HTTP helpers
  auth.tsx               login session
  pages/Dashboard.tsx    public catalog
  pages/MovieDetail.tsx
  pages/Login.tsx
  pages/AdminMovies.tsx
  pages/AdminMovieForm.tsx
```
