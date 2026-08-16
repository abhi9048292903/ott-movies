import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovie, listPlatforms, saveMovie } from "../api";
import type { AvailabilityType, MovieWrite, OttStatus, Platform } from "../types";

type Row = {
  platform_id: number | "";
  availability_type: AvailabilityType;
  region: string;
  available_from: string;
};

const emptyForm: MovieWrite = {
  title: "",
  overview: "",
  poster_url: "",
  theatrical_date: null,
  language: "hi",
  country: "IN",
  tmdb_id: null,
  ott_status: "unknown",
  announced_date: null,
  availability: [],
};

export default function AdminMovieForm() {
  const { id } = useParams();
  const movieId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [form, setForm] = useState<MovieWrite>(emptyForm);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPlatforms().then(setPlatforms).catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!movieId) return;
    getMovie(movieId)
      .then((movie) => {
        setForm({
          title: movie.title,
          overview: movie.overview ?? "",
          poster_url: movie.poster_url ?? "",
          theatrical_date: movie.theatrical_date,
          language: movie.language,
          country: movie.country,
          tmdb_id: movie.tmdb_id,
          ott_status: movie.ott?.status ?? "unknown",
          announced_date: movie.ott?.announced_date ?? null,
          availability: [],
        });
        setRows(
          movie.availability.map((item) => ({
            platform_id: item.platform.id,
            availability_type: item.availability_type,
            region: item.region,
            available_from: item.available_from ?? "",
          })),
        );
      })
      .catch((err: Error) => setError(err.message));
  }, [movieId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const payload: MovieWrite = {
      ...form,
      overview: form.overview || null,
      poster_url: form.poster_url || null,
      theatrical_date: form.theatrical_date || null,
      announced_date: form.ott_status === "unknown" ? null : form.announced_date || null,
      availability: rows
        .filter((row) => row.platform_id !== "")
        .map((row) => ({
          platform_id: Number(row.platform_id),
          availability_type: row.availability_type,
          region: row.region || "IN",
          available_from: row.available_from || null,
        })),
    };
    try {
      await saveMovie(payload, movieId);
      navigate("/admin/movies");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 720 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {movieId ? "Update movie" : "Add movie"}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Title"
        required
        fullWidth
        value={form.title}
        onChange={(event) => setForm({ ...form, title: event.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Overview"
        fullWidth
        multiline
        minRows={3}
        value={form.overview ?? ""}
        onChange={(event) => setForm({ ...form, overview: event.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Poster URL"
        fullWidth
        value={form.poster_url ?? ""}
        onChange={(event) => setForm({ ...form, poster_url: event.target.value })}
        sx={{ mb: 2 }}
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Theatrical date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={form.theatrical_date ?? ""}
          onChange={(event) => setForm({ ...form, theatrical_date: event.target.value || null })}
        />
        <TextField
          label="Language"
          fullWidth
          value={form.language}
          onChange={(event) => setForm({ ...form, language: event.target.value })}
        />
        <TextField
          label="Country"
          fullWidth
          value={form.country}
          onChange={(event) => setForm({ ...form, country: event.target.value })}
        />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>OTT status</InputLabel>
          <Select
            label="OTT status"
            value={form.ott_status}
            onChange={(event) => setForm({ ...form, ott_status: event.target.value as OttStatus })}
          >
            <MenuItem value="available">Available now</MenuItem>
            <MenuItem value="announced">Date announced</MenuItem>
            <MenuItem value="unknown">Not announced (predict)</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Announced OTT date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          disabled={form.ott_status === "unknown"}
          value={form.announced_date ?? ""}
          onChange={(event) => setForm({ ...form, announced_date: event.target.value || null })}
        />
      </Stack>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Platforms
      </Typography>
      {rows.map((row, index) => (
        <Stack key={index} direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Platform</InputLabel>
            <Select
              label="Platform"
              value={row.platform_id}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, platform_id: Number(event.target.value) };
                setRows(next);
              }}
            >
              {platforms.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={row.availability_type}
              onChange={(event) => {
                const next = [...rows];
                next[index] = { ...row, availability_type: event.target.value as AvailabilityType };
                setRows(next);
              }}
            >
              <MenuItem value="stream">Stream</MenuItem>
              <MenuItem value="rent">Rent</MenuItem>
              <MenuItem value="buy">Buy</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Region"
            value={row.region}
            onChange={(event) => {
              const next = [...rows];
              next[index] = { ...row, region: event.target.value };
              setRows(next);
            }}
            sx={{ width: 100 }}
          />
          <IconButton
            aria-label="Remove platform"
            onClick={() => setRows(rows.filter((_, rowIndex) => rowIndex !== index))}
          >
            ×
          </IconButton>
        </Stack>
      ))}
      <Button
        sx={{ mb: 3 }}
        onClick={() =>
          setRows([...rows, { platform_id: "", availability_type: "stream", region: "IN", available_from: "" }])
        }
      >
        Add platform
      </Button>
      <Box>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
}
