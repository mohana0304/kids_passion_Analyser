// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Building, Hammer, Wrench } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface BuildingGameProps {
//   onGameComplete: (score: number, timeSpent: number) => void;
// }

// export const BuildingGame = ({ onGameComplete }: BuildingGameProps) => {
//   const [score, setScore] = useState(0);
//   const [startTime] = useState(Date.now());
//   const [tower, setTower] = useState<string[]>([]);
//   const [selectedBlock, setSelectedBlock] = useState("");
//   const [gameTimer, setGameTimer] = useState(60);
//   const [gameOver, setGameOver] = useState(false);
//   const [currentStructure, setCurrentStructure] = useState(0);
//   const [gameStage, setGameStage] = useState<'building' | 'complete' | 'gameOver'>('building');
//   const { toast } = useToast();

//   const blocks = [
//     { id: "red", color: "bg-red-400", emoji: "🧱", name: "Red Brick" },
//     { id: "blue", color: "bg-blue-400", emoji: "🟦", name: "Blue Block" },
//     { id: "green", color: "bg-green-400", emoji: "🟩", name: "Green Block" },
//     { id: "yellow", color: "bg-yellow-400", emoji: "🟨", name: "Yellow Block" },
//     { id: "purple", color: "bg-purple-400", emoji: "🟪", name: "Purple Block" },
//     { id: "orange", color: "bg-orange-400", emoji: "🟧", name: "Orange Block" },
//   ];

//   const structures = [
//     {
//       name: "Basic Tower",
//       pattern: ["red", "blue", "green"],
//       reward: 50,
//     },
//     {
//       name: "Color Stack",
//       pattern: ["yellow", "yellow", "purple", "purple"],
//       reward: 80,
//     },
//     {
//       name: "Rainbow Pillar",
//       pattern: ["red", "orange", "yellow", "green", "blue"],
//       reward: 100,
//     },
//   ];

//   const currentStructureData = structures[currentStructure];

//   // Game timer logic
//   useEffect(() => {
//     if (gameStage === 'building' && gameTimer > 0 && !gameOver) {
//       const timer = setInterval(() => {
//         setGameTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else if (gameTimer === 0 && gameStage === 'building') {
//       setGameStage('gameOver');
//       setGameOver(true);
//       toast({
//         title: "⏰ Time's Up!",
//         description: `Game Over! Your final score: ${score}`,
//         duration: 3000,
//       });
//     }
//   }, [gameTimer, gameStage, gameOver]);

//   const addBlock = (blockId: string) => {
//     if (gameStage !== 'building' || gameOver) return;
//     const block = blocks.find((b) => b.id === blockId);
//     if (block) {
//       const expectedBlock = currentStructureData.pattern[tower.length];
//       if (block.id === expectedBlock) {
//         setTower((prev) => [...prev, block.emoji]);
//         setScore((prev) => prev + 10 + tower.length * 2);
//         toast({
//           title: "✅ Correct Block!",
//           description: `${block.name} fits perfectly!`,
//           duration: 1000,
//         });
//         if (tower.length + 1 === currentStructureData.pattern.length) {
//           setScore((prev) => prev + currentStructureData.reward);
//           setGameStage('complete');
//           toast({
//             title: "🏗️ Structure Complete!",
//             description: `You built the ${currentStructureData.name}! +${currentStructureData.reward} points!`,
//             duration: 2000,
//           });
//         }
//       } else {
//         setScore((prev) => prev - 5);
//         toast({
//           title: "❌ Wrong Block!",
//           description: `Try a different block for the ${currentStructureData.name}.`,
//           duration: 1000,
//         });
//       }
//     }
//   };

//   const clearTower = () => {
//     if (gameStage !== 'building' || gameOver) return;
//     setTower([]);
//     setScore((prev) => prev - 10);
//     toast({
//       title: "🧹 Tower Cleared!",
//       description: "Ready to build again!",
//       duration: 1000,
//     });
//   };

//   const buildBridge = () => {
//     if (gameStage !== 'building' || gameOver) return;
//     if (tower.length >= 3) {
//       setScore((prev) => prev + 50);
//       toast({
//         title: "🌉 Bridge Built!",
//         description: "Amazing engineering skills!",
//         duration: 2000,
//       });
//       setTower([]);
//       setGameTimer(60);
//     } else {
//       toast({
//         title: "Need more blocks!",
//         description: "Build at least 3 blocks first!",
//         duration: 1500,
//       });
//     }
//   };

//   const endGame = () => {
//     setGameStage('gameOver');
//     setGameOver(true);
//     const timeSpent = (Date.now() - startTime) / 1000;
//     onGameComplete(score, timeSpent);
//     toast({
//       title: "🏗️ Building Game Complete!",
//       description: `You scored ${score} points in ${timeSpent.toFixed(1)} seconds!`,
//       duration: 3000,
//     });
//   };

//   const restartGame = () => {
//     setScore(0);
//     setTower([]);
//     setCurrentStructure(0);
//     setGameTimer(60);
//     setGameOver(false);
//     setGameStage('building');
//   };

//   const nextStructure = () => {
//     if (currentStructure < structures.length - 1) {
//       setCurrentStructure((prev) => prev + 1);
//       setTower([]);
//       setGameTimer(60);
//       setGameStage('building');
//     } else {
//       endGame();
//     }
//   };

//   const renderBuilding = () => (
//     <>
//       <div className="bg-white/50 rounded-lg p-6 mb-6 min-h-[300px]">
//         <h3 className="text-xl font-bold text-engineering mb-4 text-center">
//           Your Construction (Goal: {currentStructureData.pattern.map((id) => blocks.find((b) => b.id === id)?.emoji).join(" ")})
//         </h3>
//         <div className="flex flex-col-reverse items-center space-y-1">
//           {tower.map((block, index) => (
//             <div
//               key={index}
//               className={`text-4xl animate-bounce-in ${
//                 currentStructureData.pattern[index] === blocks.find((b) => b.emoji === block)?.id
//                   ? "text-green-500"
//                   : "text-red-500"
//               }`}
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               {block}
//             </div>
//           ))}
//           {tower.length === 0 && (
//             <div className="text-6xl text-muted-foreground animate-pulse">
//               🏗️
//             </div>
//           )}
//         </div>
//         <div className="w-full h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-4"></div>
//       </div>

//       <div className="grid grid-cols-3 gap-4 mb-6">
//         {blocks.map((block) => (
//           <Button
//             key={block.id}
//             onClick={() => addBlock(block.id)}
//             className={`
//               h-20 text-lg font-semibold transition-all duration-300
//               ${block.color} text-white hover:scale-105 hover:shadow-lg
//               flex flex-col items-center justify-center
//             `}
//             disabled={gameOver || gameStage !== 'building'}
//           >
//             <span className="text-2xl">{block.emoji}</span>
//             <span className="text-xs">{block.name}</span>
//           </Button>
//         ))}
//       </div>

//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <Button
//           onClick={buildBridge}
//           className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
//           disabled={gameOver || gameStage !== 'building'}
//         >
//           <Hammer className="w-6 h-6 mr-2" />
//           Build Bridge
//         </Button>
//         <Button
//           onClick={clearTower}
//           className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
//           disabled={gameOver || gameStage !== 'building'}
//         >
//           <Wrench className="w-6 h-6 mr-2" />
//           Clear Tower
//         </Button>
//         <Button
//           onClick={() => setScore((prev) => prev + 25)}
//           className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
//           disabled={gameOver || gameStage !== 'building'}
//         >
//           <Building className="w-6 h-6 mr-2" />
//           Design Mode
//         </Button>
//       </div>
//     </>
//   );

//   const renderComplete = () => (
//     <div className="space-y-6">
//       <div className="text-center">
//         <div className="text-6xl mb-4">🎉</div>
//         <h3 className="text-2xl font-bold mb-4">
//           {currentStructureData.name} Completed!
//         </h3>
//         <p className="text-lg text-muted-foreground mb-4">
//           Amazing work! You built the {currentStructureData.name}!
//         </p>
//         <div className="flex flex-col-reverse items-center space-y-1 mb-4">
//           {tower.map((block, index) => (
//             <div
//               key={index}
//               className="text-4xl text-green-500 animate-bounce-in"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               {block}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="text-center">
//         <Button
//           onClick={nextStructure}
//           className="bg-engineering hover:bg-engineering/90 text-engineering-foreground px-8 py-3"
//         >
//           {currentStructure < structures.length - 1 ? 'Next Structure' : 'Finish Game'}
//         </Button>
//       </div>
//     </div>
//   );

//   const renderGameOver = () => (
//     <div className="space-y-6">
//       <div className="text-center">
//         <div className="text-6xl mb-4">😔</div>
//         <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
//         <p className="text-lg text-muted-foreground mb-4">
//           Final Score: {score}
//         </p>
//       </div>
//       <div className="text-center">
//         <Button
//           onClick={restartGame}
//           className="bg-engineering hover:bg-engineering/90 text-engineering-foreground px-8 py-3"
//         >
//           Restart Game
//         </Button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <div className="text-center space-y-4">
//         <div className="text-6xl animate-bounce">🏗️</div>
//         <h1 className="text-4xl font-bold text-engineering">Building Blocks</h1>
//         <p className="text-lg text-muted-foreground">
//           Build structures by stacking the right blocks in time!
//         </p>
//       </div>

//       <Card className="p-8 bg-gradient-to-br from-engineering/10 to-engineering/20">
//         <div className="flex justify-between items-center mb-6">
//           <div className="text-2xl font-bold text-engineering">Score: {score}</div>
//           <div className="text-lg text-engineering">
//             Time Left: {gameTimer}s
//           </div>
//           <div className="text-lg text-engineering">
//             Structure: {currentStructureData.name}
//           </div>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//           <div
//             className="bg-engineering h-2 rounded-full"
//             style={{ width: `${((currentStructure + 1) / structures.length) * 100}%` }}
//           ></div>
//         </div>

//         {gameStage === 'building' && renderBuilding()}
//         {gameStage === 'complete' && renderComplete()}
//         {gameStage === 'gameOver' && renderGameOver()}

//         <div className="text-center">
//           <Button
//             onClick={endGame}
//             className="bg-engineering hover:bg-engineering/90 text-engineering-foreground px-8 py-3 text-lg"
//           >
//             <Building className="w-5 h-5 mr-2" />
//             Finish Building
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Hammer, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BuildingGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const BuildingGame = ({ onGameComplete }: BuildingGameProps) => {
  const HEIGHT = 10;
  const WIDTH = 15;
  const blocks = [
    { id: "red", color: "bg-red-400", emoji: "🧱", name: "Red Brick" },
    { id: "blue", color: "bg-blue-400", emoji: "🟦", name: "Blue Block" },
    { id: "green", color: "bg-green-400", emoji: "🟩", name: "Green Block" },
    { id: "yellow", color: "bg-yellow-400", emoji: "🟨", name: "Yellow Block" },
    { id: "purple", color: "bg-purple-400", emoji: "🟪", name: "Purple Block" },
    { id: "orange", color: "bg-orange-400", emoji: "🟧", name: "Orange Block" }
  ];
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [world, setWorld] = useState(() => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null)));
  const [selectedBlock, setSelectedBlock] = useState(blocks[0].id);
  const [mode, setMode] = useState<"place" | "mine">("place");
  const { toast } = useToast();

  const handleClick = (row: number, col: number) => {
    const newWorld = world.map(r => [...r]);
    if (mode === "place") {
      if (selectedBlock) {
        newWorld[row][col] = selectedBlock;
        setWorld(newWorld);
        const height = HEIGHT - row;
        setScore(prev => prev + 10 + (height * 2));
        const block = blocks.find(b => b.id === selectedBlock);
        toast({
          title: `🏗️ ${block?.name} Placed!`,
          description: `Great job building at height ${height}!`,
          duration: 1000,
        });
      }
    } else if (mode === "mine") {
      if (newWorld[row][col]) {
        newWorld[row][col] = null;
        setWorld(newWorld);
        toast({
          title: "⛏️ Block Mined!",
          description: "Spot cleared for new ideas!",
          duration: 1000,
        });
      }
    }
  };

  const clearWorld = () => {
    setWorld(Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null)));
    toast({
      title: "🧹 World Cleared!",
      description: "Ready to build something new!",
      duration: 1000,
    });
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const placed = world.flat().filter(b => b !== null).length;
    onGameComplete(score, timeSpent);
    toast({
      title: "🏗️ Building Game Complete!",
      description: `You placed ${placed} blocks and scored ${score} points!`,
      duration: 3000,
    });
  };

  const placed = world.flat().filter(b => b !== null).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🏗️</div>
        <h1 className="text-4xl font-bold text-engineering">Craft World Building</h1>
        <p className="text-lg text-muted-foreground">
          Place blocks to build amazing structures like houses and more!
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-engineering/10 to-engineering/20">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-engineering">Score: {score}</div>
          <div className="text-lg text-engineering">
            Blocks Placed: {placed}
          </div>
          <div className="text-lg text-engineering">
            Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </div>
        </div>

        {/* Building Area */}
        <div className="bg-sky-100 rounded-lg p-4 mb-6 flex flex-col justify-end">
          <div className="flex flex-col">
            {world.map((rowData, row) => (
              <div key={row} className="flex">
                {rowData.map((cell, col) => {
                  const block = cell ? blocks.find(b => b.id === cell) : null;
                  return (
                    <div
                      key={col}
                      className={`w-10 h-10 flex items-center justify-center cursor-pointer ${
                        block ? block.color : "bg-transparent hover:bg-white/20"
                      }`}
                      onClick={() => handleClick(row, col)}
                    >
                      {block && <span className="text-2xl">{block.emoji}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Ground */}
          <div className="w-full h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
        </div>

        {/* Block Selection */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {blocks.map((block) => (
            <Button
              key={block.id}
              onClick={() => setSelectedBlock(block.id)}
              className={`
                h-20 text-lg font-semibold transition-all duration-300
                ${block.color} text-white hover:scale-105 hover:shadow-lg
                flex flex-col items-center justify-center
                ${selectedBlock === block.id ? "ring-4 ring-engineering" : ""}
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
            onClick={() => setMode("place")}
            className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
          >
            <Building className="w-6 h-6 mr-2" />
            Place Mode
          </Button>
          <Button
            onClick={() => setMode("mine")}
            className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
          >
            <Hammer className="w-6 h-6 mr-2" />
            Mine Mode
          </Button>
          <Button
            onClick={clearWorld}
            className="bg-engineering/20 hover:bg-engineering/30 text-engineering p-4 h-16"
          >
            <Wrench className="w-6 h-6 mr-2" />
            Clear All
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