import { Dispatch, SetStateAction } from "react";
import type { ReactNode } from "react";

// Full flower data structure (from data source)
export interface Flower {
  id: number;
  name: string;
  meaning: string;
  birthMonth: string;
  size: "small" | "medium" | "large";
  color?: string;
}

// Individual flower type in the bouquet
export interface BouquetFlower {
  id: number;
  count: number;
}

// Letter/card data attached to the bouquet
export interface BouquetLetter {
  sender: string;
  recipient: string;
  message: ReactNode;
  title?: string;
  songTitle?: string;
  songUrl?: string;
  songPlatform?: "auto" | "youtube" | "spotify" | "soundcloud";
  cardColor?: string;
  font?: string;
}

// Main bouquet data structure
export interface Bouquet {
  mode: string;
  flowers: BouquetFlower[];
  letter: BouquetLetter;
  timestamp: number;
  greenery: number;
  flowerOrder: number[];
  font?: string;
}

// Type for the setBouquet function passed to components
export type SetBouquet = Dispatch<SetStateAction<Bouquet>>;

// Props type for components that receive bouquet and setBouquet
export interface BouquetProps {
  bouquet: Bouquet;
  setBouquet: SetBouquet;
}

// Props type for components that only receive bouquet (read-only)
export interface BouquetReadOnlyProps {
  bouquet: Bouquet;
  hideFlowers?: boolean;
}
