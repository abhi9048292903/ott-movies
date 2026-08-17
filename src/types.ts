export type OttStatus = "available" | "announced" | "unknown";
export type AvailabilityType = "stream" | "rent" | "buy";

export type Platform = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
};

export type Availability = {
  id: number;
  platform: Platform;
  availability_type: AvailabilityType;
  region: string;
  available_from: string | null;
};

export type OttInfo = {
  status: OttStatus;
  announced_date: string | null;
  predicted_date: string | null;
  predicted_window_days: number | null;
  window_start: string | null;
  window_end: string | null;
  confidence: number | null;
  likely_platform: Platform | null;
  platform_confidence: number | null;
  model_version: string | null;
  generated_at: string | null;
};

export type Movie = {
  id: number;
  title: string;
  overview: string | null;
  poster_url: string | null;
  theatrical_date: string | null;
  language: string;
  country: string;
  tmdb_id: number | null;
  ott: OttInfo | null;
  availability: Availability[];
};

export type MovieWrite = {
  title: string;
  overview: string | null;
  poster_url: string | null;
  theatrical_date: string | null;
  language: string;
  country: string;
  tmdb_id: number | null;
  ott_status: OttStatus;
  announced_date: string | null;
  availability: {
    platform_id: number;
    availability_type: AvailabilityType;
    region: string;
    available_from: string | null;
  }[];
};
