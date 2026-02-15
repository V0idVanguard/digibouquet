"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Bouquet, SetBouquet, Flower } from "@/types/bouquet";
import {
  generateDefaultFlowerOrder,
  calculateTotalFlowers,
  validateFlowerCount,
} from "@/lib/bouquet-utils";

// Context type definition
interface BouquetContextType {
  bouquet: Bouquet;
  setBouquet: SetBouquet;
  totalFlowers: number;
  canProceed: boolean;
  addFlower: (flower: Flower) => void;
  removeFlower: (flowerId: number) => void;
}

// Create the context
const BouquetContext = createContext<BouquetContextType | undefined>(undefined);

// Provider component props
interface BouquetProviderProps {
  children: ReactNode;
  mode: string;
}

// Provider component
export function BouquetProvider({ children, mode }: BouquetProviderProps) {
  // Initialize bouquet state
  const [bouquet, setBouquet] = useState<Bouquet>({
    mode: mode,
    flowers: [],
    letter: {
      title: "",
      songTitle: "",
      sender: "",
      recipient: "",
      message: "",
      songUrl: "",
      songPlatform: "auto",
      cardColor: "#ffffff",
    },
    greenery: 0,
    timestamp: Date.now(),
    flowerOrder: [],
    font: "martian",
  });

  // Calculate total flowers for validation using utility function
  const totalFlowers = calculateTotalFlowers(bouquet.flowers);

  // Check if user can proceed to next step using utility function
  const canProceed = validateFlowerCount(bouquet.flowers);

  // Function to add a flower to the bouquet
  const addFlower = (flower: Flower) => {
    setBouquet((prev) => {
      // Check if this flower type already exists in the bouquet
      const existingFlower = prev.flowers.find((f) => f.id === flower.id);
      let newFlowers;

      if (existingFlower) {
        // If flower exists, increase its count
        newFlowers = prev.flowers.map((f) =>
          f.id === flower.id ? { ...f, count: f.count + 1 } : f
        );
      } else {
        // If flower doesn't exist, add it with count 1
        newFlowers = [...prev.flowers, { id: flower.id, count: 1 }];
      }

      // Generate new flower order for the updated flowers using utility function
      const newFlowerOrder = generateDefaultFlowerOrder(newFlowers);

      return {
        ...prev,
        flowers: newFlowers,
        flowerOrder: newFlowerOrder,
      };
    });
  };

  // Function to remove a flower from the bouquet
  const removeFlower = (flowerId: number) => {
    setBouquet((prev) => {
      // Find the flower to remove
      const existingFlower = prev.flowers.find((f) => f.id === flowerId);
      if (!existingFlower) return prev; // If flower doesn't exist, do nothing

      let newFlowers;
      if (existingFlower.count <= 1) {
        // If count is 1 or less, remove the flower entirely
        newFlowers = prev.flowers.filter((f) => f.id !== flowerId);
      } else {
        // If count is more than 1, decrease the count
        newFlowers = prev.flowers.map((f) =>
          f.id === flowerId ? { ...f, count: f.count - 1 } : f
        );
      }

      // Generate new flower order for the updated flowers using utility function
      const newFlowerOrder = generateDefaultFlowerOrder(newFlowers);

      return {
        ...prev,
        flowers: newFlowers,
        flowerOrder: newFlowerOrder,
      };
    });
  };

  const contextValue: BouquetContextType = {
    bouquet,
    setBouquet,
    totalFlowers,
    canProceed,
    addFlower,
    removeFlower,
  };

  return (
    <BouquetContext.Provider value={contextValue}>
      {children}
    </BouquetContext.Provider>
  );
}

// Custom hook to use the bouquet context
export function useBouquet(): BouquetContextType {
  const context = useContext(BouquetContext);

  if (context === undefined) {
    throw new Error("useBouquet must be used within a BouquetProvider");
  }

  return context;
}

// Export context for any advanced use cases
export { BouquetContext };
