import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { listMovies } from "../api";
import StatusChip from "../components/StatusChip";
import type { Movie } from "../types";

export default function AdminMovies() {
  const [q, setQ] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      listMovies({ q: q.trim() || undefined })
        .then(setMovies)
        .catch((err: Error) => setError(err.message));
    }, 200);
    return () => window.clearTimeout(handle);
  }, [q]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Movie data entry
        </Typography>
        <Button variant="contained" component={RouterLink} to="/admin/movies/new">
          Add movie
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Search existing titles"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {movies.map((movie) => (
        <Box
          key={movie.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={600}>{movie.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {movie.theatrical_date ?? "No theatrical date"}
            </Typography>
          </Box>
          <StatusChip status={movie.ott?.status} />
          <Button component={RouterLink} to={`/admin/movies/${movie.id}/edit`}>
            Edit
          </Button>
        </Box>
      ))}
    </Box>
  );
}
