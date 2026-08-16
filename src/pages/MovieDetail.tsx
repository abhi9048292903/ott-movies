import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovie } from "../api";
import StatusChip, { ottLabel } from "../components/StatusChip";
import type { Movie } from "../types";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getMovie(Number(id))
      .then(setMovie)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!movie) return <Typography color="text.secondary">Loading…</Typography>;

  const confidence =
    movie.ott?.confidence != null ? `${Math.round(movie.ott.confidence * 100)}% confidence` : null;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {movie.title}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <StatusChip status={movie.ott?.status} />
        <Typography color="text.secondary">{ottLabel(movie)}</Typography>
      </Stack>
      {movie.overview && (
        <Typography sx={{ mb: 2, maxWidth: 720 }}>{movie.overview}</Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Theatrical: {movie.theatrical_date ?? "not set"} · Language: {movie.language} · Region: {movie.country}
      </Typography>
      {movie.ott?.status === "unknown" && movie.ott.predicted_date && (
        <Alert severity="info" sx={{ mb: 2, maxWidth: 720 }}>
          Estimated OTT arrival {movie.ott.predicted_date}
          {movie.ott.predicted_window_days != null
            ? ` (about ${movie.ott.predicted_window_days} days after theatrical)`
            : ""}
          {confidence ? ` · ${confidence}` : ""}. This is not an official studio date.
        </Alert>
      )}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Where to watch
      </Typography>
      {movie.availability.length === 0 ? (
        <Typography color="text.secondary">No platform listed yet.</Typography>
      ) : (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {movie.availability.map((item) => (
            <Chip
              key={item.id}
              label={`${item.platform.name} · ${item.availability_type} · ${item.region}`}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
