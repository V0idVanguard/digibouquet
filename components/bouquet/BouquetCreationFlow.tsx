"use client";

import { useState } from "react";
import FlowerPicker from "../stages/FlowerPicker";
import BouquetCustomizer from "../stages/BouquetCustomizer";
import CardWriter from "../stages/CardWriter";
import ShareBouquet from "../stages/ShareBouquet";
import Image from "next/image";
import Link from "next/link";
import { useBouquet } from "../../context/BouquetContext";

// Define the 4 steps of the bouquet creation process
const steps = ["Pick Flowers", "Customize Bouquet", "Write Card", "Share"];

// Client component that uses the bouquet context
export default function BouquetCreationFlow() {
  const { bouquet, canProceed } = useBouquet();

  // Track which step the user is currently on (0-3)
  const [currentStep, setCurrentStep] = useState(0);

  // Navigation functions
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1)); // Move forward, but don't exceed max step
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0)); // Move backward, but don't go below 0

  return (
    <main
      className="container flex min-h-screen flex-col p-4 mx-auto"
      style={{
        backgroundImage: `linear-gradient(180deg, ${
          bouquet.letter.cardColor || "#ffffff"
        } 0%, #ffffff 100%)`,
      }}
    >
      {/* Logo/Branding */}
      <Link href="/">
        <Image
          src="/digibouquet.png"
          alt="digibouquet"
          width={200}
          height={80}
          className="object-cover mx-auto mt-6"
          priority
        />
      </Link>

      {/* Main content area - renders different components based on current step */}
      <div className="flex-grow py-8">
        {/* Step 0: Flower Selection - Users pick flowers for their bouquet */}
        {currentStep === 0 && <FlowerPicker />}

        {/* Step 1: Bouquet Customization - Users arrange and customize their flowers */}
        {currentStep === 1 && <BouquetCustomizer />}

        {/* Step 2: Card Writing - Users write a message for their bouquet */}
        {currentStep === 2 && <CardWriter />}

        {/* Step 3: Sharing - Users can share their completed bouquet */}
        {currentStep === 3 && <ShareBouquet />}
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-row gap-4 justify-center m-auto">
        {/* Back button - only show if not on first step */}
        {currentStep > 0 && (
          <button
            onClick={prevStep}
            className="text-sm px-4 py-2 border border-[#000000]"
          >
            BACK
          </button>
        )}

        {/* Next button - only show if not on last step */}
        {currentStep < steps.length - 1 && (
          <button
            onClick={nextStep}
            disabled={!canProceed}
            className={`text-sm px-4 py-2 ml-auto ${
              canProceed
                ? "bg-[#000000] text-[#F5F5DC]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            NEXT
          </button>
        )}
      </div>
    </main>
  );
}
