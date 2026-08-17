import type { Movie, MovieWrite, Platform } from "./types";

const API = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "https://ott-movies-be.kkabhilash72.workers.dev" : "/api");

function headers(auth = false): HeadersInit {
  const token = localStorage.getItem("ott_token");
  const base: HeadersInit = { "Content-Type": "application/json" };
  if (auth && token) {
    return { ...base, Authorization: `Bearer ${token}` };
  }
  return base;
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body.detail === "string") return body.detail;
    return JSON.stringify(body.detail ?? body);
  } catch {
    return res.statusText;
  }
}

export async function login(email: string, password: string): Promise<{ access_token: string; role: string }> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function listPlatforms(): Promise<Platform[]> {
  const res = await fetch(`${API}/platforms`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function listMovies(params: { q?: string; platform?: string; status?: string } = {}): Promise<Movie[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.platform) search.set("platform", params.platform);
  if (params.status) search.set("status", params.status);
  const res = await fetch(`${API}/movies?${search.toString()}`);
  if (!res.ok) throw new Error(await parseError(res));
  const data: { items: Movie[] } = await res.json();
  return data.items;
}

export async function getMovie(id: number): Promise<Movie> {
  const res = await fetch(`${API}/movies/${id}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function saveMovie(payload: MovieWrite, id?: number): Promise<Movie> {
  const res = await fetch(id ? `${API}/movies/${id}` : `${API}/movies`, {
    method: id ? "PUT" : "POST",
    headers: headers(true),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
