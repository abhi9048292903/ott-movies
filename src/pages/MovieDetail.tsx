import ArrowBack from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovie } from "../api";
import StatusChip, {
  confidenceLabel,
  formatOttDay,
  formatOttWindow,
  isOnOtt,
  platformNames,
} from "../components/StatusChip";
import type { Movie } from "../types";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const platforms = platformNames(movie);
  const ott = movie.ott;
  const predictedWindow = formatOttWindow(ott);
  const mostLikelyDate = formatOttDay(ott?.predicted_date);
  const confidence = confidenceLabel(ott?.confidence);
  const likelyPlatform = ott?.likely_platform?.name;
  const platformConfidence = confidenceLabel(ott?.platform_confidence);

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => {
          const idx = (window.history.state as { idx?: number } | null)?.idx;
          if (idx && idx > 0) navigate(-1);
          else navigate("/");
        }}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {movie.title}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <StatusChip status={ott?.status} />
      </Stack>
      {movie.overview && (
        <Typography sx={{ mb: 2, maxWidth: 720 }}>{movie.overview}</Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Theatrical: {movie.theatrical_date ?? "not set"} · Language: {movie.language} · Region: {movie.country}
      </Typography>

      {isOnOtt(movie) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Official / Confirmed
          </Typography>
          <Typography sx={{ mb: 1 }}>Streaming now{platforms.length ? ` on ${platforms.join(", ")}` : ""}.</Typography>
        </Box>
      )}

      {ott?.status === "announced" && (
        <Box sx={{ mb: 2, maxWidth: 720 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Announced
          </Typography>
          <Typography>
            Official OTT date: {formatOttDay(ott.announced_date) ?? "date listed by studio"}
          </Typography>
          <Typography sx={{ mt: 0.5 }}>
            Platform: {platforms.length ? platforms.join(", ") : "to be confirmed"}
          </Typography>
        </Box>
      )}

      {ott?.status === "unknown" && (
        <Box sx={{ maxWidth: 720 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Predicted
          </Typography>
          <Typography sx={{ mb: 0.5 }}>Expected OTT: {predictedWindow ?? "window not available yet"}</Typography>
          <Typography sx={{ mb: 0.5 }}>Most likely: {mostLikelyDate ?? "—"}</Typography>
          <Typography sx={{ mb: 0.5 }}>Confidence: {confidence ?? "—"}</Typography>
          <Typography sx={{ mb: 1 }}>
            Most likely platform: {likelyPlatform ?? "to be announced"}
            {platformConfidence ? ` (${platformConfidence})` : ""}
          </Typography>
          <Alert severity="info">
            This is an estimate from historical theatrical-to-OTT windows, not an official studio date.
          </Alert>
        </Box>
      )}

      {isOnOtt(movie) && platforms.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          {platforms.map((name) => (
            <Chip key={name} label={name} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
