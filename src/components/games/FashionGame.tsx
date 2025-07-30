import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface FashionGameProps {
  onBack: () => void;
  onGameComplete: (score: number, timeSpent: number) => void;
}

const FashionGame: React.FC<FashionGameProps> = ({ onBack, onGameComplete }) => {
  const tops = ["👚", "👕", "👔", "🧥"];
  const bottoms = ["👖", "🩳", "👗", "👘"];
  const accessories = ["👒", "🧢", "🕶️", "🎒"];

  const [selectedTop, setSelectedTop] = useState<string | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<string | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    setStartTime(Date.now()); // Start timer on mount
  }, []);

  const resetOutfit = () => {
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedAccessory(null);
    setScore(null);
  };

  const submitOutfit = () => {
    let newScore = 0;
    if (selectedTop) newScore += 1;
    if (selectedBottom) newScore += 1;
    if (selectedAccessory) newScore += 1;
    setScore(newScore);
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score ?? 0, timeSpent);
    onBack();
  };

  return (
    <div className="p-6 space-y-6">
      

      <h1 className="text-2xl font-bold text-center text-pink-600">🎀 Fashion Design Game 🎀</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tops */}
        <Card className="p-4 space-y-2">
          <h2 className="font-semibold text-lg text-center text-violet-700">Tops</h2>
          <div className="flex justify-center gap-2 flex-wrap">
            {tops.map((top) => (
              <Button
                key={top}
                variant={selectedTop === top ? "default" : "outline"}
                onClick={() => setSelectedTop(top)}
              >
                {top}
              </Button>
            ))}
          </div>
        </Card>

        {/* Bottoms */}
        <Card className="p-4 space-y-2">
          <h2 className="font-semibold text-lg text-center text-blue-700">Bottoms</h2>
          <div className="flex justify-center gap-2 flex-wrap">
            {bottoms.map((bottom) => (
              <Button
                key={bottom}
                variant={selectedBottom === bottom ? "default" : "outline"}
                onClick={() => setSelectedBottom(bottom)}
              >
                {bottom}
              </Button>
            ))}
          </div>
        </Card>

        {/* Accessories */}
        <Card className="p-4 space-y-2">
          <h2 className="font-semibold text-lg text-center text-yellow-700">Accessories</h2>
          <div className="flex justify-center gap-2 flex-wrap">
            {accessories.map((accessory) => (
              <Button
                key={accessory}
                variant={selectedAccessory === accessory ? "default" : "outline"}
                onClick={() => setSelectedAccessory(accessory)}
              >
                {accessory}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Selected Outfit */}
      <Card className="p-4 text-center border-dashed border-2 border-pink-400">
        <h2 className="text-xl font-semibold text-purple-600 mb-2">Your Outfit</h2>
        <div className="text-4xl">
          {selectedTop || "⬜"} {selectedBottom || "⬜"} {selectedAccessory || "⬜"}
        </div>
        <p className="mt-2 text-sm text-gray-600">Tap emojis to build your outfit!</p>

        {score !== null && (
          <p className="mt-3 text-md font-medium text-green-600">
            🎯 Your Score: {score} / 3
          </p>
        )}

        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <Button variant="ghost" className="text-red-600" onClick={resetOutfit}>
            🔄 Reset Outfit
          </Button>
          <Button variant="secondary" onClick={submitOutfit}>
            ✅ Submit Outfit
          </Button>
          {score !== null && (
            <Button variant="default" onClick={endGame}>
              🚪 End Game
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FashionGame;
