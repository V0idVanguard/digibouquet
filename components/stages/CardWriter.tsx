import Image from "next/image";
import { useBouquet } from "../../context/BouquetContext";
import BouquetMusicPlayer from "../bouquet/BouquetMusicPlayer";

const colorPalette = [
  "#ffffff",
  "#fff7e6",
  "#fdf2f8",
  "#eef2ff",
  "#ecfeff",
  "#f0fdf4",
  "#fef2f2",
  "#f4f4f5",
];

export default function CardWriter() {
  const { bouquet, setBouquet } = useBouquet();
  const messageValue =
    typeof bouquet.letter.message === "string" ? bouquet.letter.message : "";
  const fontOptions = [
    { value: "martian", label: "Martian Mono" },
    { value: "playfair", label: "Playfair Display" },
    { value: "crimson", label: "Crimson Text" },
    { value: "dmserif", label: "DM Serif Display" },
  ];
  const fontClassMap: Record<string, string> = {
    martian: "font-martian",
    playfair: "font-playfair",
    crimson: "font-crimson",
    dmserif: "font-dmserif",
  };
  const fontClass =
    fontClassMap[bouquet.font ?? "martian"] ?? fontClassMap.martian;
  return (
    <div className="text-center">
      <div>
        <h2 className="text-md my-8">WRITE THE CARD</h2>
        <div className="flex justify-center items-center gap-3 mb-6">
          <label htmlFor="card-font" className="text-sm uppercase">
            Card font
          </label>
          <select
            id="card-font"
            value={bouquet.font ?? "martian"}
            onChange={(e) =>
              setBouquet((prev) => ({
                ...prev,
                font: e.target.value,
              }))
            }
            className="border border-black px-3 py-2 text-sm bg-white"
          >
            {fontOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mx-auto mb-8 flex max-w-lg flex-col gap-3 text-left text-sm">
          <label htmlFor="card-title" className="uppercase">
            Card title
          </label>
          <input
            id="card-title"
            value={bouquet.letter.title || ""}
            onChange={(e) =>
              setBouquet((prev) => ({
                ...prev,
                letter: {
                  ...prev.letter,
                  title: e.target.value,
                },
              }))
            }
            placeholder="For You"
            className="border border-black bg-white px-3 py-2"
          />

          <label htmlFor="song-url" className="uppercase">
            Song URL (YouTube / Spotify / SoundCloud)
          </label>
          <input
            id="song-url"
            value={bouquet.letter.songUrl || ""}
            onChange={(e) =>
              setBouquet((prev) => ({
                ...prev,
                letter: {
                  ...prev.letter,
                  songUrl: e.target.value,
                },
              }))
            }
            placeholder="Paste song link"
            className="border border-black bg-white px-3 py-2"
          />

          <label htmlFor="song-title" className="uppercase">
            Song title (optional)
          </label>
          <input
            id="song-title"
            value={bouquet.letter.songTitle || ""}
            onChange={(e) =>
              setBouquet((prev) => ({
                ...prev,
                letter: {
                  ...prev.letter,
                  songTitle: e.target.value,
                },
              }))
            }
            placeholder="Song title"
            className="border border-black bg-white px-3 py-2"
          />

          <label htmlFor="song-platform" className="uppercase">
            Song platform
          </label>
          <select
            id="song-platform"
            value={bouquet.letter.songPlatform || "auto"}
            onChange={(e) =>
              setBouquet((prev) => ({
                ...prev,
                letter: {
                  ...prev.letter,
                  songPlatform: e.target.value as
                    | "auto"
                    | "youtube"
                    | "spotify"
                    | "soundcloud",
                },
              }))
            }
            className="border border-black bg-white px-3 py-2"
          >
            <option value="auto">Auto detect</option>
            <option value="youtube">YouTube</option>
            <option value="spotify">Spotify</option>
            <option value="soundcloud">SoundCloud</option>
          </select>

          <p className="uppercase">Card background color</p>
          <div className="flex flex-wrap gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setBouquet((prev) => ({
                    ...prev,
                    letter: {
                      ...prev.letter,
                      cardColor: color,
                    },
                  }))
                }
                className={`h-8 w-8 border border-black ${
                  bouquet.letter.cardColor === color ? "ring-2 ring-black" : ""
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Pick ${color} card color`}
              />
            ))}
          </div>
          <BouquetMusicPlayer
            songUrl={bouquet.letter.songUrl}
            songPlatform={bouquet.letter.songPlatform}
            songTitle={bouquet.letter.songTitle}
          />
        </div>
        <div className="flex flex-row items-center justify-center">
          {/* White card container with black border */}
          <div className="flex flex-row items-center justify-center -space-x-12">
            <Image
              src={`/full/flowers/daisy.png`}
              alt="card front"
              width={140}
              height={200}
              className="-rotate-12 hover:-translate-y-4 transition-all duration-300"
            />
            <Image
              src={`/full/flowers/lily.png`}
              alt="card front"
              width={140}
              height={200}
              className="-translate-y-5 hover:-translate-y-4 transition-all duration-300"
            />
            <Image
              src={`/full/flowers/anemone.png`}
              alt="card front"
              width={140}
              height={200}
              className="rotate-12 hover:-translate-y-4 transition-all duration-300"
            />
          </div>

          <div
            className={`border-2 border-black p-10 max-w-lg mx-10 ${fontClass}`}
            style={{ backgroundColor: bouquet.letter.cardColor || "#ffffff" }}
          >
            <div className="space-y-4">
              <div className="flex flex-row items-left justify-left gap-2">
                <label htmlFor="recipient">Dear </label>
                <input
                  id="recipient"
                  value={bouquet.letter.recipient || ""}
                  onChange={(e) =>
                    setBouquet((prev) => ({
                      ...prev,
                      letter: {
                        ...prev.letter,
                        recipient: e.target.value,
                      },
                    }))
                  }
                  placeholder="Beloved,"
                  className="border-none bg-transparent focus:outline-none focus:ring-0"
                />{" "}
              </div>
              <div>
                <textarea
                  id="message"
                  value={messageValue}
                  onChange={(e) =>
                    setBouquet((prev) => ({
                      ...prev,
                      letter: {
                        ...prev.letter,
                        message: e.target.value,
                      },
                    }))
                  }
                  placeholder="I have so much to tell you, but only this much space on this card! Still, you must know..."
                  rows={5}
                  className="w-full border-none bg-transparent focus:outline-none focus:ring-0"
                />
              </div>

              <div className="flex flex-col items-right justify-end gap-2">
                <label htmlFor="sender" className="text-right">
                  Sincerely,
                </label>
                <input
                  id="sender"
                  value={bouquet.letter.sender || ""}
                  onChange={(e) =>
                    setBouquet((prev) => ({
                      ...prev,
                      letter: {
                        ...prev.letter,
                        sender: e.target.value,
                      },
                    }))
                  }
                  placeholder="Secret Admirer"
                  className="border-none bg-transparent text-right focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-center -space-x-12">
            <Image
              src={`/full/flowers/carnation.png`}
              alt="card front"
              width={140}
              height={200}
              className="-rotate-12 hover:-translate-y-4 transition-all duration-300"
            />
            <Image
              src={`/full/flowers/sunflower.png`}
              alt="card front"
              width={140}
              height={200}
              className="-translate-y-5 hover:-translate-y-4 transition-all duration-300"
            />
            <Image
              src={`/full/flowers/peony.png`}
              alt="card front"
              width={140}
              height={200}
              className="rotate-12 hover:-translate-y-4 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
