import Chip from "@mui/material/Chip";
import type { Movie, OttInfo, OttStatus } from "../types";

const labels: Record<OttStatus, string> = {
  available: "Official / Confirmed",
  announced: "Announced",
  unknown: "Predicted",
};

const colors: Record<OttStatus, "success" | "info" | "warning"> = {
  available: "success",
  announced: "info",
  unknown: "warning",
};

export function isOnOtt(movie: Movie): boolean {
  return movie.ott?.status === "available";
}

export function platformNames(movie: Movie): string[] {
  const names = movie.availability.map((item) => item.platform.name);
  return [...new Set(names)];
}

export function formatOttDay(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatOttWindow(ott: OttInfo | null): string | null {
  if (!ott?.window_start || !ott.window_end) return formatOttDay(ott?.predicted_date);
  const start = formatOttDay(ott.window_start);
  const end = formatOttDay(ott.window_end);
  if (!start || !end) return null;
  return `${start} – ${end}`;
}

export function confidenceLabel(value: number | null | undefined): string | null {
  if (value == null) return null;
  return `${Math.round(value * 100)}%`;
}

export default function StatusChip({ status }: { status: OttStatus | undefined }) {
  if (!status) return null;
  return <Chip size="small" label={labels[status]} color={colors[status]} />;
}
