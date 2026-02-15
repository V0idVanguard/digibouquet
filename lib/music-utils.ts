export type SongPlatform = "auto" | "youtube" | "spotify" | "soundcloud";

interface MusicEmbed {
  embedUrl: string;
  platform: Exclude<SongPlatform, "auto">;
}

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const SPOTIFY_HOSTS = new Set(["open.spotify.com", "play.spotify.com"]);

const SOUNDCLOUD_HOSTS = new Set(["soundcloud.com", "www.soundcloud.com"]);

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const getYouTubeId = (url: URL) => {
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.slice(1);
  }

  if (url.pathname.startsWith("/watch")) {
    return url.searchParams.get("v") ?? "";
  }

  if (url.pathname.startsWith("/shorts/")) {
    return url.pathname.split("/")[2] ?? "";
  }

  if (url.pathname.startsWith("/embed/")) {
    return url.pathname.split("/")[2] ?? "";
  }

  return "";
};

const toYouTubeEmbed = (url: URL): MusicEmbed | null => {
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  return {
    embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`,
    platform: "youtube",
  };
};

const toSpotifyEmbed = (url: URL): MusicEmbed | null => {
  const segments = url.pathname.split("/").filter(Boolean);
  const type = segments[0];
  const id = segments[1];

  if (!id || !["track", "album", "playlist", "episode"].includes(type)) {
    return null;
  }

  return {
    embedUrl: `https://open.spotify.com/embed/${type}/${id}`,
    platform: "spotify",
  };
};

const toSoundCloudEmbed = (url: URL): MusicEmbed => ({
  embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    url.toString()
  )}&auto_play=true`,
  platform: "soundcloud",
});

export const getMusicEmbed = (
  rawUrl?: string,
  preferredPlatform: SongPlatform = "auto"
): MusicEmbed | null => {
  if (!rawUrl) return null;

  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return null;

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return null;
  }

  if (preferredPlatform === "youtube") {
    return toYouTubeEmbed(url);
  }

  if (preferredPlatform === "spotify") {
    return toSpotifyEmbed(url);
  }

  if (preferredPlatform === "soundcloud") {
    return toSoundCloudEmbed(url);
  }

  if (YOUTUBE_HOSTS.has(url.hostname)) {
    return toYouTubeEmbed(url);
  }

  if (SPOTIFY_HOSTS.has(url.hostname)) {
    return toSpotifyEmbed(url);
  }

  if (SOUNDCLOUD_HOSTS.has(url.hostname)) {
    return toSoundCloudEmbed(url);
  }

  return null;
};
