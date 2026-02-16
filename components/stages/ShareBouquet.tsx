import Image from "next/image";
import { flowers } from "../../data/data";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import Bouquet from "../bouquet/Bouquet";
import { useBouquet } from "../../context/BouquetContext";
import type { Bouquet as BouquetType } from "@/types/bouquet";
import { useState } from "react";

export default function ShareBouquet() {
  const { bouquet } = useBouquet();
  const [shareLink, setShareLink] = useState("");
  const [shareError, setShareError] = useState("");
  // Helper function to get flower dimensions based on size
  const getFlowerDimensions = (size: string) => {
    switch (size) {
      case "small":
        return 80;
      case "large":
        return 160;
      default:
        return 120; // medium
    }
  };

  const router = useRouter();

  const buildFallbackLink = (bouquetData: BouquetType) => {
    const serializableBouquet = {
      ...bouquetData,
      letter: {
        ...bouquetData.letter,
        message:
          typeof bouquetData.letter.message === "string"
            ? bouquetData.letter.message
            : "",
      },
    };

    const encodedBouquet = encodeURIComponent(
      JSON.stringify(serializableBouquet)
    );
    return `${window.location.origin}/bouquet/shared?data=${encodedBouquet}`;
  };

  const handleShareLink = async (url: string) => {
    setShareLink(url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Ignore clipboard permission errors; user can still copy manually.
    }
  };

  const handleCreateBouquet = async (bouquet: BouquetType) => {
    setShareError("");

    if (!supabase) {
      const fallbackUrl = buildFallbackLink(bouquet);
      await handleShareLink(fallbackUrl);
      return;
    }

    const short_id = nanoid(8);

    const { data, error } = await supabase
      .from("bouquets")
      .insert([
        {
          short_id: short_id,
          mode: bouquet.mode,
          flowers: bouquet.flowers,
          letter: {
            ...bouquet.letter,
            font: bouquet.font,
          },
          timestamp: bouquet.timestamp,
          greenery: bouquet.greenery,
          flowerOrder: bouquet.flowerOrder,
        },
      ])
      .select(); // returns inserted row(s)

    if (error || !data || data.length === 0) {
      setShareError("Could not create a database link, using local link.");
      const fallbackUrl = buildFallbackLink(bouquet);
      await handleShareLink(fallbackUrl);
      return;
    }

    const bouquetId = data[0].id;
    const databaseUrl = `${window.location.origin}/bouquet/${bouquetId}`;
    await handleShareLink(databaseUrl);
    router.push(`/bouquet/${bouquetId}`);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-dmserif text-center mb-8 tracking-wide normal-case">
        {bouquet.letter.title?.trim() || "SEND THE BOUQUET"}
      </h2>

      <Bouquet bouquet={bouquet} />
      <button
        onClick={() => {
          handleCreateBouquet(bouquet);
        }}
        className="mt-14 uppercase text-white bg-black px-5 py-3"
      >
        CREATE SHAREABLE LINK
      </button>
      {shareError ? <p className="mt-3 text-sm text-red-600">{shareError}</p> : null}
      {shareLink ? (
        <div className="mx-auto mt-14 w-full max-w-xl text-left">
          <p className="text-xs uppercase mb-2">Share link</p>
          <input
            readOnly
            value={shareLink}
            className="w-full border border-black bg-white px-3 py-2 text-xs"
          />
        </div>
      ) : null}
    </div>
  );
}
