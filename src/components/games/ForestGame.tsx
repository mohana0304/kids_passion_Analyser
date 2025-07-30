import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trees, Rabbit, Bird, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForestGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const ForestGame = ({ onGameComplete }: ForestGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [discoveredAnimals, setDiscoveredAnimals] = useState<string[]>([]);
  const [currentArea, setCurrentArea] = useState("forest");
  const { toast } = useToast();

  const areas = [
    { id: "forest", name: "🌲 Deep Forest", animals: ["🐰", "🦌", "🐿️"] },
    { id: "meadow", name: "🌻 Sunny Meadow", animals: ["🦋", "🐝", "🐞"] },
    { id: "river", name: "🏞️ Crystal River", animals: ["🐸", "🦆", "🐟"] },
    { id: "mountain", name: "⛰️ Rocky Mountain", animals: ["🦅", "🐐", "🦫"] }
  ];

  const discoverAnimal = (animal: string, area: string) => {
    if (!discoveredAnimals.includes(animal)) {
      setDiscoveredAnimals(prev => [...prev, animal]);
      setScore(prev => prev + 20);
      
      toast({
        title: `🎉 New Discovery!`,
        description: `You found a ${animal} in the ${area}!`,
        duration: 2000,
      });
    } else {
      setScore(prev => prev + 5);
      toast({
        title: `${animal} is happy to see you again!`,
        description: "Keep exploring!",
        duration: 1500,
      });
    }
  };

  const exploreArea = (areaId: string) => {
    setCurrentArea(areaId);
    setScore(prev => prev + 10);
    
    toast({
      title: `🗺️ Exploring ${areas.find(a => a.id === areaId)?.name}`,
      description: "Look for animals hiding around!",
      duration: 1500,
    });
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    
    toast({
      title: "🌍 Forest Adventure Complete!",
      description: `You discovered ${discoveredAnimals.length} animals and scored ${score} points!`,
      duration: 3000,
    });
  };

  const currentAreaData = areas.find(a => a.id === currentArea)!;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🌳</div>
        <h1 className="text-4xl font-bold text-nature">Forest Adventure</h1>
        <p className="text-lg text-muted-foreground">
          Explore the magical forest and discover amazing animals!
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-nature/10 to-nature/20">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-nature">Score: {score}</div>
          <div className="text-lg text-nature">
            Animals Found: {discoveredAnimals.length}/12
          </div>
        </div>

        {/* Area Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {areas.map((area) => (
            <Button
              key={area.id}
              onClick={() => exploreArea(area.id)}
              className={`
                h-20 text-lg font-semibold transition-all duration-300
                ${currentArea === area.id 
                  ? 'bg-nature text-nature-foreground shadow-lg scale-105' 
                  : 'bg-nature/20 text-nature hover:bg-nature/30'
                }
              `}
            >
              {area.name}
            </Button>
          ))}
        </div>

        {/* Current Area Animals */}
        <div className="bg-white/50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-nature mb-4">
            {currentAreaData.name}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {currentAreaData.animals.map((animal, index) => (
              <Button
                key={index}
                onClick={() => discoverAnimal(animal, currentAreaData.name)}
                className={`
                  h-24 text-4xl bg-white/70 hover:bg-white/90 
                  border-2 border-nature/30 hover:border-nature
                  transition-all duration-300 hover:scale-110
                  ${discoveredAnimals.includes(animal) ? 'bg-nature/20' : ''}
                `}
              >
                {animal}
              </Button>
            ))}
          </div>
        </div>

        {/* Discovered Animals Display */}
        {discoveredAnimals.length > 0 && (
          <div className="bg-nature/10 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-nature mb-2">Your Animal Collection:</h4>
            <div className="flex flex-wrap gap-2">
              {discoveredAnimals.map((animal, index) => (
                <span key={index} className="text-2xl animate-bounce">
                  {animal}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={endGame}
            className="bg-nature hover:bg-nature/90 text-nature-foreground px-8 py-3 text-lg"
          >
            <Trees className="w-5 h-5 mr-2" />
            End Adventure
          </Button>
        </div>
      </Card>
    </div>
  );
};