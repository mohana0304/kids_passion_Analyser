import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Hammer, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BuildingGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const BuildingGame = ({ onGameComplete }: BuildingGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [tower, setTower] = useState<string[]>([]);
  const [selectedBlock, setSelectedBlock] = useState("");
  const { toast } = useToast();

  const blocks = [
    { id: "red", color: "bg-red-400", emoji: "🧱", name: "Red Brick" },
    { id: "blue", color: "bg-blue-400", emoji: "🟦", name: "Blue Block" },
    { id: "green", color: "bg-green-400", emoji: "🟩", name: "Green Block" },
    { id: "yellow", color: "bg-yellow-400", emoji: "🟨", name: "Yellow Block" },
    { id: "purple", color: "bg-purple-400", emoji: "🟪", name: "Purple Block" },
    { id: "orange", color: "bg-orange-400", emoji: "🟧", name: "Orange Block" }
  ];

  const addBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setTower(prev => [...prev, block.emoji]);
      setScore(prev => prev + 10 + (tower.length * 2)); // Bonus for height
      
      toast({
        title: `🏗️ Block Added!`,
        description: `Great job! Your tower is ${tower.length + 1} blocks high!`,
        duration: 1000,
      });
    }
  };

  const clearTower = () => {
    setTower([]);
    toast({
      title: "🧹 Tower Cleared!",
      description: "Ready to build something new!",
      duration: 1000,
    });
  };

  const buildBridge = () => {
    if (tower.length >= 3) {
      setScore(prev => prev + 50);
      toast({
        title: "🌉 Bridge Built!",
        description: "Amazing engineering skills!",
        duration: 2000,
      });
    } else {
      toast({
        title: "Need more blocks!",
        description: "Build at least 3 blocks first!",
        duration: 1500,
      });
    }
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    
    toast({
      title: "🏗️ Building Game Complete!",
      description: `You built a ${tower.length}-block tower and scored ${score} points!`,
      duration: 3000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🏗️</div>
        <h1 className="text-4xl font-bold text-engineering">Building Blocks</h1>
        <p className="text-lg text-muted-foreground">
          Stack blocks to build amazing towers and bridges!
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-engineering/10 to-engineering/20">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-engineering">Score: {score}</div>
          <div className="text-lg text-engineering">
            Tower Height: {tower.length} blocks
          </div>
        </div>

        {/* Building Area */}
        <div className="bg-white/50 rounded-lg p-6 mb-6 min-h-[300px]">
          <h3 className="text-xl font-bold text-engineering mb-4 text-center">
            Your Construction
          </h3>
          
          {/* Tower Display */}
          <div className="flex flex-col-reverse items-center space-y-1">
            {tower.map((block, index) => (
              <div
                key={index}
                className="text-4xl animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {block}
              </div>
            ))}
            {tower.length === 0 && (
              <div className="text-6xl text-muted-foreground animate-pulse">
                🏗️
              </div>
            )}
          </div>
          
          {/* Ground */}
          <div className="w-full h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-4"></div>
        </div>

        {/* Block Selection */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {blocks.map((block) => (
            <Button
              key={block.id}
              onClick={() => addBlock(block.id)}
              className={`
                h-20 text-lg font-semibold transition-all duration-300
                ${block.color} text-white hover:scale-105 hover:shadow-lg
                flex flex-col items-center justify-center
              `}
            >
              <span className="text-2xl">{block.emoji}</span>
              <span className="text-xs">{block.name}</span>
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button
            onClick={buildBridge}
            className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
          >
            <Hammer className="w-6 h-6 mr-2" />
            Build Bridge
          </Button>
          <Button
            onClick={clearTower}
            className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
          >
            <Wrench className="w-6 h-6 mr-2" />
            Clear Tower
          </Button>
          <Button
            onClick={() => setScore(prev => prev + 25)}
            className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
          >
            <Building className="w-6 h-6 mr-2" />
            Design Mode
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={endGame}
            className="bg-engineering hover:bg-engineering/90 text-engineering-foreground px-8 py-3 text-lg"
          >
            <Building className="w-5 h-5 mr-2" />
            Finish Building
          </Button>
        </div>
      </Card>
    </div>
  );
};