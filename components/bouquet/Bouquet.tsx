import Image from "next/image";
import { flowers } from "../../data/data";
import type { BouquetReadOnlyProps } from "@/types/bouquet";
import BouquetMusicPlayer from "./BouquetMusicPlayer";

const fontClassMap: Record<string, string> = {
  martian: "font-martian",
  playfair: "font-playfair",
  crimson: "font-crimson",
  dmserif: "font-dmserif",
};

const getFontClass = (bouquet: BouquetReadOnlyProps["bouquet"]) => {
  const fontKey = bouquet.font ?? bouquet.letter?.font;
  return fontClassMap[fontKey ?? "martian"] ?? fontClassMap.martian;
};

export default function Bouquet({ bouquet, hideFlowers }: BouquetReadOnlyProps) {
  const fontClass = getFontClass(bouquet);
  const getRotation = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    }
    const normalized = Math.abs(hash % 1000) / 1000;
    return normalized * 10 - 5;
  };

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

  return (
    <div className="text-center">
      {!hideFlowers && (
        <div className="flex flex-col max-w-lg mx-auto">
          <div className="flex relative justify-center items-center py-4 my-4">
            <div className="relative w-full max-w-[460px] min-h-[300px] sm:min-h-[410px] mx-auto">
              {/* Bush background images - positioned absolutely to stay fixed */}
              {/* Bottom bush layer */}

              <Image
                src={`/${bouquet.mode}/bush/bush-${bouquet.greenery + 1}.png`}
                alt="bush background"
                width={600}
                height={500}
                className="absolute top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2"
                priority
              />

              {/* Flower container - flowers can move around within this area */}

              <div className="flex flex-wrap reverse w-[220px] sm:w-[300px] justify-center items-center -space-x-2 sm:-space-x-4 -space-y-12 sm:-space-y-20 relative m-auto">
                {/* Map through each flower type and create individual flower instances */}
                {bouquet.flowers.flatMap(
                  (
                    flower: { id: number; count: number },
                    flowerIndex: number
                  ) => {
                    // Get flower data from the imported flowers array
                    const flowerData = flowers.find((f) => f.id === flower.id);
                    if (!flowerData) return [];

                    // For each flower type, create the specified number of instances
                    return Array(flower.count)
                      .fill(null)
                      .map((_, instanceIndex) => {
                        const rotation = getRotation(
                          `${bouquet.mode}-${bouquet.greenery}-${flower.id}-${flowerIndex}-${instanceIndex}`
                        );

                        // Determine the visual order of this flower instance
                        // If flowerOrder has values, use it; otherwise use default order
                        const index =
                          bouquet.flowerOrder.length > 0
                            ? bouquet.flowerOrder[
                                flowerIndex * flower.count + instanceIndex
                              ] ?? flowerIndex * flower.count + instanceIndex
                            : flowerIndex * flower.count + instanceIndex;

                        // Get dimensions based on flower size
                        const dimensions = getFlowerDimensions(flowerData.size);

                        return (
                          <div
                            key={`${flowerIndex}-${instanceIndex}`}
                            className="flex relative justify-center items-center pt-4"
                            style={{ order: index }} // CSS order property controls visual arrangement
                          >
                            {/* Individual flower image */}
                            <Image
                              src={`/${bouquet.mode}/flowers/${flowerData.name}.png`}
                              alt={flowerData.name}
                              width={dimensions}
                              height={dimensions}
                              className="relative z-10 transition-transform hover:scale-105"
                              style={{ transform: `rotate(${rotation}deg)` }} // Apply random rotation
                              priority
                            />
                          </div>
                        );
                      });
                  }
                )}
              </div>

              {/* Top bush layer */}

              <div>
                <Image
                  src={`/${bouquet.mode}/bush/bush-${
                    bouquet.greenery + 1
                  }-top.png`}
                  alt="bush top"
                  width={600}
                  height={500}
                  className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-sm text-sm text-center">
        <div>
          {/* White card container with black border */}
          <div
            className={`border-[1.5px] border-black p-8 mx-auto -translate-y-[50px] -rotate-2 hover:-rotate-2 transition-all duration-300 ${fontClass}`}
            style={{ backgroundColor: bouquet.letter.cardColor || "#ffffff" }}
          >
            <div className="space-y-4">
              <div className="flex flex-row gap-2 items-start justify-start">
                <p className="bg-transparent border-none focus:outline-none focus:ring-0">
                  Dear {bouquet.letter.recipient}
                </p>
              </div>

              <div className="text-left whitespace-pre-line">
                {bouquet.letter.message}
              </div>

              <div className="flex flex-col gap-2 justify-end items-end">
                <p className="bg-transparent border-none focus:outline-none focus:ring-0">
                  With love,
                </p>
                <p className="bg-transparent border-none focus:outline-none focus:ring-0">
                  {bouquet.letter.sender}
                </p>
              </div>
            </div>
          </div>
          <BouquetMusicPlayer
            songUrl={bouquet.letter.songUrl}
            songPlatform={bouquet.letter.songPlatform}
            songTitle={bouquet.letter.songTitle}
          />
        </div>
      </div>
    </div>
  );
}
