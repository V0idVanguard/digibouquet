"use client";

import Bouquet from "@/components/bouquet/Bouquet";
import BouquetHero from "@/components/bouquet/BouquetHero";
import BouquetMusicPlayer from "@/components/bouquet/BouquetMusicPlayer";

const songUrl = "https://www.youtube.com/watch?v=VjipUXcbGKA";

const letterMessage = (
  <>
    <p>
      I love the way I <em>LOVE YOU</em>.
    </p>
    <p>
      Even though I know you would not walk with me into a snowstorm because you
      hate it - but I also know you would if I asked. Not because you have to,
      but because your heart is just that kind.
    </p>
    <p>
      And do not worry... even if you said no, I would probably drag you with me
      anyway.
    </p>
    <p>
      I absolutely adore everything about you. The way you quietly put up with
      my <em>nataks</em>, the way you care without pointing my drama - regardless
      how much I annoy you, to the point where you would just go{" "}
      <em>"bye"</em>.
    </p>
    <p>
      I love the way <em>YOU LOVE ME</em>.
    </p>
    <p>
      I am really lucky to have you. And I am so proud of the person you are.
    </p>
  </>
);

const bouquet = {
  mode: "color",
  flowers: [
    { id: 2, count: 2 },
    { id: 11, count: 2 },
    { id: 12, count: 2 },
    { id: 2, count: 2 },
    { id: 8, count: 1 },
    { id: 5, count: 1 },
  ],
  letter: {
    sender: "Rushi",
    recipient: "Naiyu",
    message: letterMessage,
    font: "playfair",
  },
  greenery: 2,
  timestamp: Date.now(),
  flowerOrder: [],
  font: "playfair",
};

export default function LovePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#f2f7ff] via-[#eaf2ff] to-[#e0ecff] text-[#1d1d1d]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-dmserif mb-4">
            For You, Always
          </h1>
          <p className="text-sm uppercase tracking-[0.2em]">February 14, 2026</p>
        </div>

        <div className="flex flex-col items-center gap-2 relative">
          <div className="pointer-events-none absolute left-1/2 top-[40%] z-[5] w-[125vw] max-w-[980px] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d7e8ff]" />
          <div className="-mb-16 sm:-mb-24 -translate-x-3 sm:-translate-x-5 relative z-20">
            <BouquetHero mode={bouquet.mode} greenery={bouquet.greenery} />
          </div>
          <div className="relative z-10 animate-card-rise">
            <Bouquet bouquet={bouquet} hideFlowers />
          </div>
          <div className="text-center">
            <BouquetMusicPlayer songUrl={songUrl} songPlatform="youtube" />
            <p className="mt-3 text-xs text-gray-600">
              If audio does not auto-play, tap the play button or open it on{" "}
              <a
                href={songUrl}
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}