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
import { expectedOttDate, isOnOtt, platformNames } from "../components/StatusChip";
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
  const ottDate = expectedOttDate(movie);

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
      {movie.overview && (
        <Typography sx={{ mb: 2, maxWidth: 720 }}>{movie.overview}</Typography>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Theatrical: {movie.theatrical_date ?? "not set"} · Language: {movie.language} · Region: {movie.country}
      </Typography>
      {isOnOtt(movie) ? (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Available on
          </Typography>
          {platforms.length === 0 ? (
            <Typography color="text.secondary">No platform listed yet.</Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {platforms.map((name) => (
                <Chip key={name} label={name} />
              ))}
            </Stack>
          )}
        </>
      ) : (
        <Box sx={{ maxWidth: 720 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Expected OTT
          </Typography>
          <Typography sx={{ mb: 1 }}>
            Expected OTT release date: {ottDate ?? "to be announced"}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Expected OTT platform: {platforms.length ? platforms.join(", ") : "to be announced"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
