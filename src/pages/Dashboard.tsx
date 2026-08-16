import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { listMovies, listPlatforms } from "../api";
import { isOnOtt, platformNames } from "../components/StatusChip";
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
        Search the catalog for platforms and expected OTT dates.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}. Start the API from <code>ott-movies-be</code> on port 8000.
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
            <MenuItem value="unknown">Coming soon</MenuItem>
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
                  {isOnOtt(movie) ? (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      {platformNames(movie).length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          Available on OTT
                        </Typography>
                      ) : (
                        platformNames(movie).map((name) => <Chip key={name} size="small" label={name} />)
                      )}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Coming soon
                    </Typography>
                  )}
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
