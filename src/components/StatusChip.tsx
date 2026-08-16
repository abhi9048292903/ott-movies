import Chip from "@mui/material/Chip";
import type { Movie, OttStatus } from "../types";

const labels: Record<OttStatus, string> = {
  available: "On OTT",
  announced: "Date announced",
  unknown: "Predicted",
};

const colors: Record<OttStatus, "success" | "info" | "warning"> = {
  available: "success",
  announced: "info",
  unknown: "warning",
};

export function ottLabel(movie: Movie): string {
  const ott = movie.ott;
  if (!ott) return "No date";
  if (ott.status === "available") {
    const names = movie.availability.map((item) => item.platform.name).join(", ");
    return names ? `Watch on ${names}` : "Available";
  }
  if (ott.status === "announced" && ott.announced_date) {
    return `OTT on ${ott.announced_date}`;
  }
  if (ott.predicted_date) {
    return `Predicted ${ott.predicted_date}`;
  }
  return "OTT date unknown";
}

export default function StatusChip({ status }: { status: OttStatus | undefined }) {
  if (!status) return null;
  return <Chip size="small" label={labels[status]} color={colors[status]} />;
}
