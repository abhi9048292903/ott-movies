import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { listMovies, listPlatforms } from "../api";
import StatusChip, { ottLabel } from "../components/StatusChip";
import type { Movie, OttStatus, Platform } from "../types";

export default function Dashboard() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | OttStatus>("");
  const [platform, setPlatform] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPlatforms().then(setPlatforms).catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      listMovies({
        q: q.trim() || undefined,
        status: status || undefined,
        platform: platform || undefined,
      })
        .then(setMovies)
        .catch((err: Error) => setError(err.message));
    }, 250);
    return () => window.clearTimeout(handle);
  }, [q, status, platform]);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Find where to watch
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Search the catalog for platforms and OTT dates. Predicted dates are estimates when studios have not announced yet.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}. Start the API with <code>uvicorn app.main:app --reload</code> from <code>backend/</code>.
        </Alert>
      )}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <TextField
          label="Search movies"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          sx={{ minWidth: 260, flex: 1 }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value as "" | OttStatus)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="available">On OTT</MenuItem>
            <MenuItem value="announced">Date announced</MenuItem>
            <MenuItem value="unknown">Predicted</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Platform</InputLabel>
          <Select label="Platform" value={platform} onChange={(event) => setPlatform(event.target.value)}>
            <MenuItem value="">All</MenuItem>
            {platforms.map((item) => (
              <MenuItem key={item.id} value={item.slug}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid key={movie.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardActionArea component={RouterLink} to={`/movie/${movie.id}`}>
                <Box
                  sx={{
                    height: 180,
                    bgcolor: "action.hover",
                    backgroundImage: movie.poster_url ? `url(${movie.poster_url})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <StatusChip status={movie.ott?.status} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {ottLabel(movie)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {!error && movies.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          No movies match this search.
        </Typography>
      )}
    </Box>
  );
}
