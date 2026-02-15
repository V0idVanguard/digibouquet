import Image from "next/image";

interface BouquetHeroProps {
  mode: string;
  greenery: number;
}

const placements = [
  { name: "orchid", size: 128, left: 15, top: 8, rotate: -12, z: 8 },
  { name: "anemone", size: 126, left: 58, top: 8, rotate: 10, z: 8 },
  { name: "carnation", size: 170, left: 25, top: 10, rotate: -4, z: 7 },
  { name: "rose", size: 135, left: 56, top: 20, rotate: 8, z: 8 },
  { name: "rose", size: 132, left: 12, top: 24, rotate: -7, z: 7 },
  { name: "rose", size: 118, left: 10, top: 36, rotate: -10, z: 8 },
  { name: "orchid", size: 108, left: 15, top: 44, rotate: -16, z: 8 },
  { name: "sunflower", size: 210, left: 24, top: 33, rotate: 2, z: 9 },
  { name: "lily", size: 185, left: 50, top: 28, rotate: -6, z: 7 },
  { name: "daisy", size: 110, left: 20, top: 52, rotate: -8, z: 7 },
  { name: "peony", size: 145, left: 40, top: 50, rotate: 3, z: 7 },
  { name: "rose", size: 130, left: 60, top: 48, rotate: 9, z: 8 },
  { name: "zinnia", size: 120, left: 38, top: 62, rotate: -2, z: 8 },
  { name: "tulip", size: 120, left: 74, top: 41, rotate: 14, z: 7 },
  { name: "orchid", size: 110, left: 66, top: 56, rotate: 12, z: 7 },
];

export default function BouquetHero({ mode, greenery }: BouquetHeroProps) {
  return (
    <div className="relative mx-auto w-[tter92vw] max-w-[720px] h-[560px] sm:h-[720px] animate-bouquet-rise">
      <Image
        src={`/${mode}/bush/bush-${greenery + 1}.png`}
        alt="bush background"
        width={600}
        height={500}
        className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 scale-[1.08]"
        priority
      />

      <Image
        src={`/${mode}/bush/bush-${greenery + 1}-top.png`}
        alt="leafy background"
        width={600}
        height={500}
        className="absolute left-1/2 top-[46%] z-[2] -translate-x-1/2 -translate-y-1/2 opacity-85 scale-[1.15]"
        priority
      />

      {placements.map((flower, index) => (
        <Image
          key={`${flower.name}-${flower.left}-${flower.top}`}
          src={`/${mode}/flowers/${flower.name}.png`}
          alt={flower.name}
          width={flower.size}
          height={flower.size}
          className="absolute h-auto animate-flower-pop"
          style={{
            left: `${flower.left}%`,
            top: `${flower.top}%`,
            transform: `rotate(${flower.rotate}deg)`,
            zIndex: flower.z,
            animationDelay: `${120 + index * 45}ms`,
          }}
          priority
        />
      ))}

      <Image
        src={`/${mode}/bush/bush-${greenery + 1}-top.png`}
        alt="leafy foreground"
        width={600}
        height={500}
        className="absolute left-1/2 top-[55%] z-20 -translate-x-1/2 -translate-y-1/2 opacity-92 scale-[1.2]"
        priority
      />
    </div>
  );
}
