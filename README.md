# OTT Finder

React catalog + Python API. Users search movies for where to watch and (when unknown) a predicted OTT date. Admins create and update titles.

## Run locally

Terminal 1 — API (SQLite, seeded admin + sample movies):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — UI:

```bash
npm install
npm run dev
```

Open http://localhost:5173

Admin login (from `.env`): `admin@ott.local` / `admin123`

Public catalog is at `/`. Data entry is at `/admin/movies` after login.
