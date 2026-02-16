"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { SongPlatform } from "@/lib/music-utils";
import { getMusicEmbed } from "@/lib/music-utils";

interface BouquetMusicPlayerProps {
  songUrl?: string;
  songPlatform?: SongPlatform;
  songTitle?: string;
}

export default function BouquetMusicPlayer({
  songUrl,
  songPlatform = "auto",
  songTitle,
}: BouquetMusicPlayerProps) {
  const [playbackKey, setPlaybackKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasUserStartedPlayback, setHasUserStartedPlayback] = useState(false);
  const [resolvedTitle, setResolvedTitle] = useState("");
  const embed = useMemo(
    () => getMusicEmbed(songUrl, songPlatform),
    [songUrl, songPlatform]
  );

  const normalizedSongUrl = useMemo(() => {
    if (!songUrl) return "";
    if (songUrl.startsWith("http://") || songUrl.startsWith("https://")) {
      return songUrl;
    }
    return `https://${songUrl}`;
  }, [songUrl]);

  useEffect(() => {
    setIsPlaying(true);
    setHasUserStartedPlayback(false);
    setPlaybackKey(0);
  }, [embed?.embedUrl]);

  useEffect(() => {
    const explicitTitle = songTitle?.trim();
    if (explicitTitle) {
      setResolvedTitle(explicitTitle);
      return;
    }

    if (!embed || !normalizedSongUrl) {
      setResolvedTitle("");
      return;
    }

    const controller = new AbortController();

    const fetchTitle = async () => {
      try {
        let endpoint = "";

        if (embed.platform === "youtube") {
          endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
            normalizedSongUrl
          )}&format=json`;
        } else if (embed.platform === "spotify") {
          endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(
            normalizedSongUrl
          )}`;
        } else if (embed.platform === "soundcloud") {
          endpoint = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(
            normalizedSongUrl
          )}`;
        }

        if (!endpoint) {
          setResolvedTitle("");
          return;
        }

        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          setResolvedTitle("");
          return;
        }

        const data = (await response.json()) as { title?: string };
        setResolvedTitle(data.title?.trim() || "");
      } catch {
        setResolvedTitle("");
      }
    };

    fetchTitle();

    return () => {
      controller.abort();
    };
  }, [songTitle, embed, normalizedSongUrl]);

  if (!embed) {
    return null;
  }

  const headerLabel = resolvedTitle || embed.platform.toUpperCase();

  const handleTogglePlayback = () => {
    if (!hasUserStartedPlayback) {
      setPlaybackKey((current) => current + 1);
      setIsPlaying(true);
      setHasUserStartedPlayback(true);
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setPlaybackKey((current) => current + 1);
    setIsPlaying(true);
  };

  return (
    <div className="mt-3 flex flex-col items-center justify-center gap-2 text-center">
      <button
        type="button"
        onClick={handleTogglePlayback}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-black"
        aria-label={isPlaying ? "Pause song" : "Play song"}
        title={isPlaying ? "Pause song" : "Play song"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" strokeWidth={2.25} />
        ) : (
          <Play className="h-4 w-4" fill="currentColor" strokeWidth={2.25} />
        )}
      </button>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-wide">{headerLabel}</p>
      </div>

      {isPlaying ? (
        <iframe
          key={`${embed.embedUrl}-${playbackKey}`}
          title="Bouquet song"
          src={embed.embedUrl}
          allow="autoplay; encrypted-media; clipboard-write"
          className="h-[1px] w-[1px] opacity-0 pointer-events-none"
        />
      ) : null}
    </div>
  );
}
