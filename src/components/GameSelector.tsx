import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, BarChart3, User } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { useGame } from "@/context/GameContext";

// Game Components
import { MusicGame } from "@/components/games/MusicGame";
import { ForestGame } from "@/components/games/ForestGame";
import { BuildingGame } from "@/components/games/BuildingGame";
import { DrawingGame } from "@/components/games/DrawingGame";
import { WordLearningGame } from "@/components/games/WordLearningGame";
import { CookingGame } from "@/components/games/CookingGame";
import FashionGame from "@/components/games/fashionGame";
import SportsGame from "@/components/games/SportsGame";

interface GameSelectorProps {
  onShowDashboard: () => void;
}

export const GameSelector = ({ onShowDashboard }: GameSelectorProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [childName, setChildName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const { recordGameSession, currentChild, setCurrentChild } = useGame();

  const games = [
    {
      id: "music",
      title: "Music Game",
      description: "Play piano, guitar, and drums to create beautiful music!",
      icon: "🎵",
      color: "music",
      component: MusicGame
    },
    {
      id: "forest",
      title: "Forest Adventure",
      description: "Explore nature and discover amazing animals!",
      icon: "🌳",
      color: "nature",
      component: ForestGame
    },
    {
      id: "building",
      title: "Building Blocks",
      description: "Build towers, bridges, and amazing structures!",
      icon: "🏗️",
      color: "engineering",
      component: BuildingGame
    },
    {
      id: "drawing",
      title: "Drawing & Painting",
      description: "Create beautiful artwork with colors and brushes!",
      icon: "🎨",
      color: "art",
      component: DrawingGame
    },
    {
      id: "learning",
      title: "Word & Learning",
      description: "Learn letters, numbers, and new words!",
      icon: "📚",
      color: "learning",
      component: WordLearningGame
    },
    {
      id: "cooking",
      title: "Cooking Game",
      description: "Cook delicious meals and learn about ingredients!",
      icon: "🍳",
      color: "cooking",
      component: CookingGame
    },
    {
      id: "fashion",
      title: "Fashion Design",
      description: "Design clothes and create amazing outfits!",
      icon: "👗",
      color: "fashion",
      component: FashionGame // Coming soon
    },
    {
      id: "sports",
      title: "Sports Game",
      description: "Play soccer, basketball, and other fun sports!",
      icon: "⚽",
      color: "sports",
      component: SportsGame // Coming soon
    }
  ];

  const handleGameSelect = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game && game.component) {
      setSelectedGame(gameId);
    }
  };

  const handleGameComplete = (gameId: string, score: number, timeSpent: number) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      recordGameSession({
        gameType: game.title,
        score,
        timeSpent,
        timestamp: Date.now()
      });
    }
    setSelectedGame(null);
  };

  const handleChildNameSubmit = () => {
    if (childName.trim()) {
      setCurrentChild(childName.trim());
      setShowNameInput(false);
    }
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    if (game && game.component) {
      const GameComponent = game.component;
      return (
        <GameComponent
          onGameComplete={(score, timeSpent) => handleGameComplete(selectedGame, score, timeSpent)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-8xl animate-bounce">🎮</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Kids Interest Indicator
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover your child's natural talents through fun games!
          </p>
        </div>

        {/* Child Name & Controls */}
        <div className="flex items-center justify-center gap-4">
          <Card className="p-4 flex items-center gap-4">
            <User className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Playing as:</p>
              <p className="font-semibold">{currentChild}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNameInput(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Change
            </Button>
          </Card>
          
          <Button
            onClick={onShowDashboard}
            className="bg-primary hover:bg-primary/90"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Parent Dashboard
          </Button>
        </div>

        {/* Child Name Input Modal */}
        {showNameInput && (
          <Card className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Enter Child's Name</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="childName">Child's Name</Label>
                  <Input
                    id="childName"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter your child's name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleChildNameSubmit} className="flex-1">
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNameInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              icon={game.icon}
              color={game.color}
              onClick={() => handleGameSelect(game.id)}
            />
          ))}
        </div>

        {/* Fun Footer */}
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            🌟 Have fun exploring and discovering your amazing talents! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};