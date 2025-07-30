// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";

// interface SportsGameProps {
//   onBack: () => void;
//   onGameComplete: (score: number, timeSpent: number) => void;
// }

// const sportsList = ["Soccer", "Basketball", "Tennis", "Cricket"];

// const SportsGame: React.FC<SportsGameProps> = ({ onBack, onGameComplete }) => {
//   const [selectedSports, setSelectedSports] = useState<string[]>([]);
//   const [startTime, setStartTime] = useState<number>(Date.now());
//   const [score, setScore] = useState<number>(0);
//   const [gameEnded, setGameEnded] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     setStartTime(Date.now());
//   }, []);

//   const toggleSelection = (sport: string) => {
//     setSelectedSports((prev) =>
//       prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
//     );
//   };

//   const submitGame = () => {
//     const calculatedScore = selectedSports.length * 10;
//     setScore(calculatedScore);
//     toast({
//       title: "Submitted!",
//       description: `Your score is ${calculatedScore}. You can still change your selection.`,
//     });
//   };

//   const resetGame = () => {
//     setSelectedSports([]);
//     setScore(0);
//     setStartTime(Date.now());
//     toast({
//       title: "Game Reset",
//       description: "All selections cleared and timer restarted.",
//     });
//   };

//   const endGame = () => {
//     const timeSpent = (Date.now() - startTime) / 1000;
//     const finalScore = selectedSports.length * 10;
//     setScore(finalScore);
//     setGameEnded(true);
//     onGameComplete(finalScore, timeSpent);
//     toast({
//       title: "Game Ended",
//       description: `You scored ${finalScore} in ${timeSpent.toFixed(1)}s`,
//     });
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold">🏀 Sports Game</h2>
//       </div>

//       <p className="mb-3 text-gray-600">Select your favorite sports:</p>
//       <div className="grid grid-cols-2 gap-3 mb-5">
//         {sportsList.map((sport) => (
//           <Button
//             key={sport}
//             variant={selectedSports.includes(sport) ? "default" : "outline"}
//             onClick={() => toggleSelection(sport)}
//           >
//             {sport}
//           </Button>
//         ))}
//       </div>

//       <div className="flex flex-col gap-2">
//         <Button onClick={submitGame} className="bg-blue-600 text-white hover:bg-blue-700">
//           Submit
//         </Button>
//         <Button onClick={resetGame} variant="outline">
//           Reset
//         </Button>
//         <Button onClick={endGame} className="bg-green-600 text-white hover:bg-green-700">
//           End Game
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SportsGame;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SportsGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

const sportsList = ["Soccer", "Basketball", "Tennis", "Cricket"];

const SportsGame: React.FC<SportsGameProps> = ({ onGameComplete }) => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [score, setScore] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const toggleSelection = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };

  const submitGame = () => {
    const calculatedScore = selectedSports.length * 10;
    setScore(calculatedScore);
    toast({
      title: "Submitted!",
      description: `Your current score is ${calculatedScore}.`,
    });
  };

  const resetGame = () => {
    setSelectedSports([]);
    setScore(0);
    setStartTime(Date.now());
    toast({
      title: "Reset Successful",
      description: "Selections and timer have been reset.",
    });
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const finalScore = selectedSports.length * 10;
    setScore(finalScore);
    toast({
      title: "Game Over",
      description: `Final Score: ${finalScore}, Time: ${timeSpent.toFixed(1)}s`,
    });
    onGameComplete(finalScore, timeSpent);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">🏅 Sports Game</h2>

      <p className="text-center text-gray-600 mb-2">Select your favorite sports:</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {sportsList.map((sport) => (
          <Button
            key={sport}
            variant={selectedSports.includes(sport) ? "default" : "outline"}
            onClick={() => toggleSelection(sport)}
          >
            {sport}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={submitGame}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </Button>

        <Button onClick={resetGame} variant="outline">
          Reset
        </Button>

        <Button
          onClick={endGame}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          End Game
        </Button>
      </div>
    </div>
  );
};

export default SportsGame;
