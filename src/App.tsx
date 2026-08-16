import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./auth";
import AppLayout from "./layout/AppLayout";
import AdminMovieForm from "./pages/AdminMovieForm";
import AdminMovies from "./pages/AdminMovies";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";

function RequireAdmin({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/movies"
          element={
            <RequireAdmin>
              <AdminMovies />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/movies/new"
          element={
            <RequireAdmin>
              <AdminMovieForm />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/movies/:id/edit"
          element={
            <RequireAdmin>
              <AdminMovieForm />
            </RequireAdmin>
          }
        />
      </Route>
    </Routes>
  );
}
