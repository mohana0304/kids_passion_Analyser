import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Goal, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SportsGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

const SportsGame = ({ onGameComplete }: SportsGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [shots, setShots] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameTimer, setGameTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStage, setGameStage] = useState<'shooting' | 'roundComplete' | 'gameOver'>('shooting');
  const { toast } = useToast();

  const directions = [
    { id: "left", name: "Left", emoji: "⬅️" },
    { id: "center", name: "Center", emoji: "⬆️" },
    { id: "right", name: "Right", emoji: "➡️" },
  ];

  const rounds = [
    { name: "Round 1", shotsRequired: 5, reward: 50 },
    { name: "Round 2", shotsRequired: 5, reward: 75 },
    { name: "Round 3", shotsRequired: 5, reward: 100 },
  ];

  const currentRoundData = rounds[currentRound];

  // Game timer logic
  useEffect(() => {
    if (gameStage === 'shooting' && gameTimer > 0 && !gameOver) {
      const timer = setInterval(() => {
        setGameTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameTimer === 0 && gameStage === 'shooting') {
      setGameStage('gameOver');
      setGameOver(true);
      toast({
        title: "⏰ Time's Up!",
        description: `Game Over! Your final score: ${score}`,
        duration: 3000,
      });
    }
  }, [gameTimer, gameStage, gameOver]);

  const takeShot = (directionId: string) => {
    if (gameStage !== 'shooting' || gameOver) return;
    const direction = directions.find((d) => d.id === directionId);
    if (direction) {
      const goalkeeperDive = directions[Math.floor(Math.random() * 3)].id;
      const isGoal = direction.id !== goalkeeperDive;
      setShots((prev) => [...prev, isGoal ? "⚽" : "❌"]);
      if (isGoal) {
        setScore((prev) => prev + 20);
        toast({
          title: "⚽ Goal!",
          description: `You shot ${direction.name}, goalkeeper dove ${goalkeeperDive}!`,
          duration: 1000,
        });
      } else {
        setScore((prev) => prev - 5);
        toast({
          title: "🧤 Saved!",
          description: `You shot ${direction.name}, goalkeeper dove ${goalkeeperDive}!`,
          duration: 1000,
        });
      }
      if (shots.length + 1 === currentRoundData.shotsRequired) {
        setScore((prev) => prev + currentRoundData.reward);
        setGameStage('roundComplete');
        toast({
          title: "🏆 Round Complete!",
          description: `You completed ${currentRoundData.name}! +${currentRoundData.reward} points!`,
          duration: 2000,
        });
      }
    }
  };

  const resetShots = () => {
    if (gameStage !== 'shooting' || gameOver) return;
    setShots([]);
    setScore((prev) => prev - 10);
    toast({
      title: "🔄 Shots Reset!",
      description: "Ready to shoot again!",
      duration: 1000,
    });
  };

  const trickShot = () => {
    if (gameStage !== 'shooting' || gameOver) return;
    setScore((prev) => prev + 30);
    setShots((prev) => [...prev, "🌟"]);
    toast({
      title: "🌟 Trick Shot!",
      description: "Amazing skill! +30 points!",
      duration: 1500,
    });
    if (shots.length + 1 === currentRoundData.shotsRequired) {
      setScore((prev) => prev + currentRoundData.reward);
      setGameStage('roundComplete');
      toast({
        title: "🏆 Round Complete!",
        description: `You completed ${currentRoundData.name}! +${currentRoundData.reward} points!`,
        duration: 2000,
      });
    }
  };

  const endGame = () => {
    setGameStage('gameOver');
    setGameOver(true);
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    toast({
      title: "⚽ Game Complete!",
      description: `You scored ${score} points in ${timeSpent.toFixed(1)} seconds!`,
      duration: 3000,
    });
  };

  const restartGame = () => {
    setScore(0);
    setShots([]);
    setCurrentRound(0);
    setGameTimer(60);
    setGameOver(false);
    setGameStage('shooting');
  };

  const nextRound = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound((prev) => prev + 1);
      setShots([]);
      setGameTimer(60);
      setGameStage('shooting');
    } else {
      endGame();
    }
  };

  const renderShooting = () => (
    <>
      <div className="bg-white/50 rounded-lg p-6 mb-6 min-h-[300px]">
        <h3 className="text-xl font-bold text-sports mb-4 text-center">
          Penalty Shootout (Goals: {shots.filter((s) => s === "⚽").length}/{currentRoundData.shotsRequired})
        </h3>
        <div className="flex flex-row justify-center space-x-2">
          {shots.map((shot, index) => (
            <div
              key={index}
              className={`text-4xl animate-bounce-in ${
                shot === "⚽" ? "text-green-500" : shot === "🌟" ? "text-yellow-500" : "text-red-500"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {shot}
            </div>
          ))}
          {shots.length === 0 && (
            <div className="text-6xl text-muted-foreground animate-pulse">
              ⚽
            </div>
          )}
        </div>
        <div className="w-full h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {directions.map((direction) => (
          <Button
            key={direction.id}
            onClick={() => takeShot(direction.id)}
            className={`
              h-20 text-lg font-semibold transition-all duration-300
              bg-sports/20 hover:bg-sports/30 text-sports
              flex flex-col items-center justify-center
            `}
            disabled={gameOver || gameStage !== 'shooting'}
          >
            <span className="text-2xl">{direction.emoji}</span>
            <span className="text-xs">{direction.name}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          onClick={resetShots}
          className="bg-sports/20 hover:bg-sports/30 text-sports p-4 h-16"
          disabled={gameOver || gameStage !== 'shooting'}
        >
          <Goal className="w-6 h-6 mr-2" />
          Reset Shots
        </Button>
        <Button
          onClick={trickShot}
          className="bg-sports/20 hover:bg-sports/30 text-sports p-4 h-16"
          disabled={gameOver || gameStage !== 'shooting'}
        >
          {/* <soccerBall className="w-6 h-6 mr-2" /> */}
          Trick Shot
        </Button>
      </div>
    </>
  );

  const renderRoundComplete = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-4">
          {currentRoundData.name} Completed!
        </h3>
        <p className="text-lg text-muted-foreground mb-4">
          Great shooting! You scored {shots.filter((s) => s === "⚽").length} goals!
        </p>
        <div className="flex flex-row justify-center space-x-2 mb-4">
          {shots.map((shot, index) => (
            <div
              key={index}
              className={`text-4xl ${
                shot === "⚽" ? "text-green-500" : shot === "🌟" ? "text-yellow-500" : "text-red-500"
              }`}
            >
              {shot}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Button
          onClick={nextRound}
          className="bg-sports hover:bg-sports/90 text-sports-foreground px-8 py-3"
        >
          {currentRound < rounds.length - 1 ? 'Next Round' : 'Finish Game'}
        </Button>
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Final Score: {score}
        </p>
      </div>
      <div className="text-center">
        <Button
          onClick={restartGame}
          className="bg-sports hover:bg-sports/90 text-sports-foreground px-8 py-3"
        >
          Restart Game
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">⚽</div>
        <h1 className="text-4xl font-bold text-sports">Penalty Shootout</h1>
        <p className="text-lg text-muted-foreground">
          Score goals by outsmarting the goalkeeper!
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-sports/10 to-sports/20">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-sports">Score: {score}</div>
          <div className="text-lg text-sports">
            Time Left: {gameTimer}s
          </div>
          <div className="text-lg text-sports">
            {currentRoundData.name}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-sports h-2 rounded-full"
            style={{ width: `${((currentRound + 1) / rounds.length) * 100}%` }}
          ></div>
        </div>

        {gameStage === 'shooting' && renderShooting()}
        {gameStage === 'roundComplete' && renderRoundComplete()}
        {gameStage === 'gameOver' && renderGameOver()}

        <div className="text-center">
          <Button
            onClick={endGame}
            className="bg-sports hover:bg-sports/90 text-sports-foreground px-8 py-3 text-lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Finish Game
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SportsGame;