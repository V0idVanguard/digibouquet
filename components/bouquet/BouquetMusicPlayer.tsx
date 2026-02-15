"use client";

import { useMemo, useState } from "react";
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
  const embed = useMemo(
    () => getMusicEmbed(songUrl, songPlatform),
    [songUrl, songPlatform]
  );

  if (!embed) {
    return null;
  }

  const headerLabel = songTitle?.trim() || embed.platform.toUpperCase();

  return (
    <div className="mt-3 flex flex-col items-center justify-center gap-2 text-center">
      <button
        type="button"
        onClick={() => setPlaybackKey((current) => current + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-black text-lg leading-none"
        aria-label="Play song"
        title="Play song"
      >
        ▶
      </button>
      <div className="leading-tight">
        <p className="text-xs uppercase tracking-wide">{headerLabel}</p>
      </div>

      <iframe
        key={`${embed.embedUrl}-${playbackKey}`}
        title="Bouquet song"
        src={embed.embedUrl}
        allow="autoplay; encrypted-media; clipboard-write"
        className="h-[1px] w-[1px] opacity-0 pointer-events-none"
      />
    </div>
  );
}
