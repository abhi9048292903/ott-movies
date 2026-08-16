import Chip from "@mui/material/Chip";
import type { Movie, OttStatus } from "../types";

const labels: Record<OttStatus, string> = {
  available: "On OTT",
  announced: "Date announced",
  unknown: "Coming soon",
};

const colors: Record<OttStatus, "success" | "info" | "warning"> = {
  available: "success",
  announced: "info",
  unknown: "warning",
};

export function isOnOtt(movie: Movie): boolean {
  return movie.ott?.status === "available";
}

export function expectedOttDate(movie: Movie): string | null {
  const ott = movie.ott;
  if (!ott) return null;
  return ott.announced_date ?? ott.predicted_date;
}

export function platformNames(movie: Movie): string[] {
  const names = movie.availability.map((item) => item.platform.name);
  return [...new Set(names)];
}

export function ottLabel(movie: Movie): string {
  const ott = movie.ott;
  if (!ott) return "No date";
  if (ott.status === "available") {
    const names = platformNames(movie);
    return names.length ? `Watch on ${names.join(", ")}` : "Available";
  }
  if (ott.status === "announced" && ott.announced_date) {
    return `OTT on ${ott.announced_date}`;
  }
  if (ott.predicted_date) {
    return `Expected ${ott.predicted_date}`;
  }
  return "OTT date unknown";
}

export default function StatusChip({ status }: { status: OttStatus | undefined }) {
  if (!status) return null;
  return <Chip size="small" label={labels[status]} color={colors[status]} />;
}
