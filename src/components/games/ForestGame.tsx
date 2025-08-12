// // import { useState, useEffect } from "react";
// // import { Card } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Trees } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";

// // interface ForestGameProps {
// //   onGameComplete: (score: number, timeSpent: number) => void;
// // }

// // export const ForestGame = ({ onGameComplete }: ForestGameProps) => {
// //   const [score, setScore] = useState(0);
// //   const [startTime] = useState(Date.now());
// //   const [foundAnimals, setFoundAnimals] = useState<string[]>([]);
// //   const [currentLevel, setCurrentLevel] = useState(1);
// //   const { toast } = useToast();

// //   const levels = [
// //     {
// //       id: 1,
// //       name: "Autumn Glade",
// //       animals: [
// //         { emoji: "🐿️", x: "20%", y: "30%", found: false },
// //         { emoji: "🦔", x: "70%", y: "60%", found: false },
// //         { emoji: "🍂", x: "40%", y: "80%", found: false },
// //       ],
// //       background: "bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover",
// //     },
// //     {
// //       id: 2,
// //       name: "Misty Hollow",
// //       animals: [
// //         { emoji: "🦊", x: "15%", y: "45%", found: false },
// //         { emoji: "🦉", x: "65%", y: "20%", found: false },
// //         { emoji: "🐰", x: "50%", y: "75%", found: false },
// //         { emoji: "🍄", x: "30%", y: "65%", found: false },
// //       ],
// //       background: "bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover",
// //     },
// //     {
// //       id: 3,
// //       name: "Golden Forest",
// //       animals: [
// //         { emoji: "🦌", x: "25%", y: "35%", found: false },
// //         { emoji: "🦋", x: "60%", y: "50%", found: false },
// //         { emoji: "🐦", x: "45%", y: "15%", found: false },
// //         { emoji: "🌰", x: "80%", y: "70%", found: false },
// //         { emoji: "🐞", x: "10%", y: "80%", found: false },
// //       ],
// //       background: "bg-[url('https://images.unsplash.com/photo-1511497580567-2c5d9962c4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover",
// //     },
// //   ];

// //   const currentLevelData = levels.find((level) => level.id === currentLevel)!;

// //   const handleAnimalClick = (animal: { emoji: string; x: string; y: string; found: boolean }) => {
// //     if (!foundAnimals.includes(animal.emoji)) {
// //       setFoundAnimals((prev) => [...prev, animal.emoji]);
// //       setScore((prev) => prev + 20);

// //       toast({
// //         title: `🎉 Found an Animal!`,
// //         description: `You found a ${animal.emoji} in the ${currentLevelData.name}!`,
// //         duration: 2000,
// //       });

// //       // Update animal's found status
// //       currentLevelData.animals = currentLevelData.animals.map((a) =>
// //         a.emoji === animal.emoji ? { ...a, found: true } : a
// //       );

// //       // Check if level is complete
// //       if (currentLevelData.animals.every((a) => a.found || foundAnimals.includes(a.emoji))) {
// //         if (currentLevel < levels.length) {
// //           toast({
// //             title: `🌟 Level ${currentLevel} Complete!`,
// //             description: `Moving to ${levels.find((l) => l.id === currentLevel + 1)!.name}!`,
// //             duration: 2000,
// //           });
// //           setTimeout(() => {
// //             setCurrentLevel(currentLevel + 1);
// //             setFoundAnimals([]);
// //           }, 1000);
// //         } else {
// //           endGame();
// //         }
// //       }
// //     } else {
// //       setScore((prev) => prev + 5);
// //       toast({
// //         title: `${animal.emoji} Spotted Again!`,
// //         description: "Keep searching for new animals!",
// //         duration: 1500,
// //       });
// //     }
// //   };

// //   const endGame = () => {
// //     const timeSpent = (Date.now() - startTime) / 1000;
// //     onGameComplete(score, timeSpent);

// //     toast({
// //       title: "🍂 Autumn Forest Adventure Complete!",
// //       description: `You found ${foundAnimals.length} animals and scored ${score} points!`,
// //       duration: 3000,
// //     });
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto p-6 space-y-6">
// //       <div className="text-center space-y-4">
// //         <div className="text-6xl animate-bounce">🍁</div>
// //         <h1 className="text-4xl font-bold text-amber-800">Autumn Forest Search</h1>
// //         <p className="text-lg text-amber-700">
// //           Search the forest to find hidden animals!
// //         </p>
// //       </div>

// //       <Card className="p-8 bg-gradient-to-br from-amber-100/50 to-amber-200/50">
// //         <div className="flex justify-between items-center mb-6">
// //           <div className="text-2xl font-bold text-amber-800">Score: {score}</div>
// //           <div className="text-lg text-amber-800">
// //             Found: {foundAnimals.length}/{currentLevelData.animals.length} | Level: {currentLevel}
// //           </div>
// //         </div>

// //         {/* Forest Scene */}
// //         <div className={`relative h-[400px] rounded-lg ${currentLevelData.background}`}>
// //           {currentLevelData.animals.map((animal, index) => (
// //             <Button
// //               key={index}
// //               onClick={() => handleAnimalClick(animal)}
// //               className={`
// //                 absolute text-4xl bg-transparent hover:bg-amber-200/50 
// //                 border-2 border-amber-400/30 hover:border-amber-400
// //                 transition-all duration-300
// //                 ${animal.found ? "opacity-50 scale-90" : "hover:scale-110"}
// //               `}
// //               style={{ left: animal.x, top: animal.y }}
// //               disabled={animal.found}
// //             >
// //               {animal.emoji}
// //             </Button>
// //           ))}
// //           <div className="absolute bottom-4 left-4 bg-amber-800/80 text-white px-4 py-2 rounded">
// //             {currentLevelData.name}
// //           </div>
// //         </div>

// //         {/* Found Animals Display */}
// //         {foundAnimals.length > 0 && (
// //           <div className="bg-amber-100/50 rounded-lg p-4 mt-6">
// //             <h4 className="font-bold text-amber-800 mb-2">Your Animal Collection:</h4>
// //             <div className="flex flex-wrap gap-2">
// //               {foundAnimals.map((animal, index) => (
// //                 <span key={index} className="text-2xl animate-pulse">
// //                   {animal}
// //                 </span>
// //               ))}
// //             </div>
// //           </div>
// //         )}

// //         <div className="text-center mt-6">
// //           <Button
// //             onClick={endGame}
// //             className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
// //           >
// //             <Trees className="w-5 h-5 mr-2" />
// //             End Adventure
// //           </Button>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// import { useState, useEffect, useRef } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Sprout } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import * as THREE from "three";

// interface ForestGameProps {
//   onGameComplete: (score: number, timeSpent: number) => void;
// }

// export const ForestGame = ({ onGameComplete }: ForestGameProps) => {
//   const [score, setScore] = useState(0);
//   const [coins, setCoins] = useState(0);
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [plantedSeeds, setPlantedSeeds] = useState([]);
//   const [startTime] = useState(Date.now());
//   const { toast } = useToast();
//   const canvasRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const rendererRef = useRef(null);
//   const plotsRef = useRef([]);
//   const dragSeedRef = useRef(null);
//   const raycasterRef = useRef(new THREE.Raycaster());
//   const mouseRef = useRef(new THREE.Vector2());

//   const plants = {
//     carrot: { emoji: ["🌱", "🥕"], color: 0xffa500, stages: ["Seed", "Carrot"], cost: 10, reward: 20 },
//     sunflower: { emoji: ["🌱", "🌻"], color: 0xffff00, stages: ["Seed", "Sunflower"], cost: 20, reward: 50 },
//     tomato: { emoji: ["🌱", "🍅"], color: 0xff0000, stages: ["Seed", "Tomato"], cost: 30, reward: 80 },
//   };

//   const levels = [
//     {
//       id: 1,
//       name: "Beginner’s Field",
//       plots: 3,
//       availablePlants: ["carrot"],
//       unlockCost: 0,
//     },
//     {
//       id: 2,
//       name: "Sunny Acres",
//       plots: 5,
//       availablePlants: ["carrot", "sunflower"],
//       unlockCost: 100,
//     },
//     {
//       id: 3,
//       name: "Bountiful Farm",
//       plots: 7,
//       availablePlants: ["carrot", "sunflower", "tomato"],
//       unlockCost: 200,
//     },
//   ];

//   const currentLevelData = levels.find((level) => level.id === currentLevel);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     // Initialize Three.js scene
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     scene.background = new THREE.Color(0x87ceeb); // Sky blue
//     scene.fog = new THREE.Fog(0x87ceeb, 5, 15); // Fog for depth

//     const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
//     camera.position.set(0, 4, 8);
//     camera.lookAt(0, 1, 0);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
//     renderer.setSize(800, 400);
//     rendererRef.current = renderer;

//     // Add lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//     scene.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xfff8e1, 0.5);
//     directionalLight.position.set(5, 5, 5);
//     scene.add(directionalLight);

//     // Add farm field
//     const fieldGeometry = new THREE.PlaneGeometry(12, 12);
//     const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown soil
//     const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
//     field.rotation.x = -Math.PI / 2;
//     field.position.y = 0;
//     field.name = "field";
//     scene.add(field);

//     // Add decorative fence
//     const fenceGeometry = new THREE.BoxGeometry(0.2, 0.5, 12);
//     const fenceMaterial = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
//     const fence1 = new THREE.Mesh(fenceGeometry, fenceMaterial);
//     const fence2 = new THREE.Mesh(fenceGeometry, fenceMaterial);
//     fence1.position.set(6, 0.25, 0);
//     fence2.position.set(-6, 0.25, 0);
//     scene.add(fence1, fence2);

//     // Add planting plots
//     plotsRef.current = [];
//     for (let i = 0; i < currentLevelData.plots; i++) {
//       const plotGeometry = new THREE.PlaneGeometry(1, 1);
//       const plotMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Darker soil
//       const plot = new THREE.Mesh(plotGeometry, plotMaterial);
//       plot.rotation.x = -Math.PI / 2;
//       plot.position.set((i % 3) * 2 - 2, 0.01, Math.floor(i / 3) * 2 - 2);
//       plot.name = `plot${i}`;
//       plot.userData = { plant: null, stage: 0, plantType: null };
//       scene.add(plot);
//       plotsRef.current.push(plot);
//     }

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       plotsRef.current.forEach((plot) => {
//         if (plot.userData.plant && plot.userData.stage > 0) {
//           plot.userData.plant.rotation.y += 0.01; // Gentle rotation for mature plants
//         }
//       });
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Drag and drop handlers
//     const handleMouseDown = (event) => {
//       const seedType = dragSeedRef.current;
//       if (!seedType || !canvasRef.current || coins < plants[seedType].cost) return;

//       const rect = canvasRef.current.getBoundingClientRect();
//       mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//       raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
//       const intersects = raycasterRef.current.intersectObjects(plotsRef.current);

//       if (intersects.length > 0) {
//         const plot = intersects[0].object;
//         if (!plot.userData.plant) {
//           plantSeed(plot, seedType);
//         }
//       }
//     };

//     const handleMouseUp = () => {
//       dragSeedRef.current = null;
//     };

//     canvasRef.current.addEventListener("mousedown", handleMouseDown);
//     canvasRef.current.addEventListener("mouseup", handleMouseUp);

//     // Handle window resize
//     const handleResize = () => {
//       if (renderer && camera) {
//         camera.aspect = 800 / 400;
//         camera.updateProjectionMatrix();
//         renderer.setSize(800, 400);
//       }
//     };
//     window.addEventListener("resize", handleResize);

//     return () => {
//       canvasRef.current.removeEventListener("mousedown", handleMouseDown);
//       canvasRef.current.removeEventListener("mouseup", handleMouseUp);
//       window.removeEventListener("resize", handleResize);
//       renderer.dispose();
//     };
//   }, [currentLevel, coins]);

//   const plantSeed = (plot, plantType) => {
//     if (plantedSeeds.length >= currentLevelData.plots) return;

//     setCoins((prev) => prev - plants[plantType].cost);
//     const plantId = `plant${plantedSeeds.length + 1}`;
//     setPlantedSeeds((prev) => [...prev, { id: plantId, plot: plot.name, type: plantType, stage: 0 }]);
//     setScore((prev) => prev + 10);

//     toast({
//       title: "🌱 Seed Planted!",
//       description: `You planted a ${plantType} seed in ${currentLevelData.name}!`,
//       duration: 2000,
//     });

//     // Add seed sprite
//     const canvas = document.createElement("canvas");
//     canvas.width = 64;
//     canvas.height = 64;
//     const ctx = canvas.getContext("2d");
//     ctx.font = "40px Arial";
//     ctx.fillText(plants[plantType].emoji[0], 16, 48);
//     const texture = new THREE.Texture(canvas);
//     texture.needsUpdate = true;
//     const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
//     const sprite = new THREE.Sprite(spriteMaterial);
//     sprite.position.set(plot.position.x, 0.5, plot.position.z);
//     sprite.scale.set(0.5, 0.5, 0.5);
//     sprite.name = plantId;
//     sceneRef.current.add(sprite);

//     plot.userData = { plant: sprite, stage: 0, plantType };
//     checkLevelComplete();
//   };

//   const waterPlant = (plot) => {
//     if (!plot.userData.plant || plot.userData.stage >= plants[plot.userData.plantType].emoji.length - 1) return;

//     const plantId = plot.userData.plant.name;
//     const plantType = plot.userData.plantType;
//     const newStage = plot.userData.stage + 1;

//     setPlantedSeeds((prev) =>
//       prev.map((seed) =>
//         seed.id === plantId ? { ...seed, stage: newStage } : seed
//       )
//     );
//     setScore((prev) => prev + 20);

//     toast({
//       title: "💧 Plant Watered!",
//       description: `Your ${plantType} grew to a ${plants[plantType].stages[newStage]}!`,
//       duration: 2000,
//     });

//     // Update plant sprite
//     const canvas = document.createElement("canvas");
//     canvas.width = 64;
//     canvas.height = 64;
//     const ctx = canvas.getContext("2d");
//     ctx.font = "40px Arial";
//     ctx.fillText(plants[plantType].emoji[newStage], 16, 48);
//     const texture = new THREE.Texture(canvas);
//     texture.needsUpdate = true;
//     plot.userData.plant.material.map = texture;
//     plot.userData.plant.scale.set(0.6 + newStage * 0.2, 0.6 + newStage * 0.2, 0.6 + newStage * 0.2);
//     plot.userData.stage = newStage;

//     checkLevelComplete();
//   };

//   const harvestPlant = (plot) => {
//     if (!plot.userData.plant || plot.userData.stage < plants[plot.userData.plantType].emoji.length - 1) return;

//     const plantId = plot.userData.plant.name;
//     const plantType = plot.userData.plantType;
//     setCoins((prev) => prev + plants[plantType].reward);
//     setPlantedSeeds((prev) => prev.filter((seed) => seed.id !== plantId));
//     setScore((prev) => prev + 30);

//     toast({
//       title: "🌾 Plant Harvested!",
//       description: `You harvested a ${plantType} for ${plants[plantType].reward} coins!`,
//       duration: 2000,
//     });

//     sceneRef.current.remove(plot.userData.plant);
//     plot.userData = { plant: null, stage: 0, plantType: null };
//     checkLevelComplete();
//   };

//   const unlockNextLevel = () => {
//     const nextLevel = levels.find((level) => level.id === currentLevel + 1);
//     if (nextLevel && coins >= nextLevel.unlockCost) {
//       setCoins((prev) => prev - nextLevel.unlockCost);
//       setCurrentLevel(currentLevel + 1);
//       setPlantedSeeds([]);
//       plotsRef.current.forEach((plot) => {
//         if (plot.userData.plant) {
//           sceneRef.current.remove(plot.userData.plant);
//           plot.userData = { plant: null, stage: 0, plantType: null };
//         }
//       });
//       toast({
//         title: `🌟 Level Unlocked!`,
//         description: `Welcome to ${nextLevel.name}!`,
//         duration: 2000,
//       });
//     } else {
//       toast({
//         title: "🔒 Not Enough Coins!",
//         description: `You need ${nextLevel.unlockCost} coins to unlock ${nextLevel.name}.`,
//         duration: 2000,
//       });
//     }
//   };

//   const checkLevelComplete = () => {
//     const allGrownAndHarvested = plantedSeeds.length === 0 && plotsRef.current.every((plot) => !plot.userData.plant);
//     if (allGrownAndHarvested && currentLevel < levels.length) {
//       toast({
//         title: `🌾 Level ${currentLevel} Cleared!`,
//         description: `Unlock ${levels.find((l) => l.id === currentLevel + 1).name} for ${levels.find((l) => l.id === currentLevel + 1).unlockCost} coins!`,
//         duration: 2000,
//       });
//     } else if (allGrownAndHarvested && currentLevel === levels.length) {
//       endGame();
//     }
//   };

//   const endGame = () => {
//     const timeSpent = (Date.now() - startTime) / 1000;
//     onGameComplete(score, timeSpent);

//     toast({
//       title: "🚜 Farm Tycoon Complete!",
//       description: `You scored ${score} points and earned ${coins} coins!`,
//       duration: 3000,
//     });
//   };

//   const startDrag = (plantType) => {
//     dragSeedRef.current = plantType;
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <div className="text-center space-y-4">
//         <div className="text-6xl animate-pulse">🚜</div>
//         <h1 className="text-4xl font-bold text-green-800">Anki Farm Tycoon</h1>
//         <p className="text-lg text-green-600">
//           Drag seeds to plant, water to grow, and harvest to earn coins!
//         </p>
//       </div>

//       <Card className="p-8 bg-gradient-to-br from-green-100/50 to-emerald-100/50">
//         <div className="flex justify-between items-center mb-6">
//           <div className="text-2xl font-bold text-green-800">Score: {score} | Coins: {coins}</div>
//           <div className="text-lg text-green-800">
//             Plots: {plantedSeeds.length}/{currentLevelData.plots} | Level: {currentLevel}
//           </div>
//         </div>

//         <div className="flex gap-4 mb-6">
//           {currentLevelData.availablePlants.map((plantType) => (
//             <Button
//               key={plantType}
//               onMouseDown={() => startDrag(plantType)}
//               disabled={coins < plants[plantType].cost}
//               className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-lg ${coins < plants[plantType].cost ? "opacity-50 cursor-not-allowed" : ""}`}
//             >
//               {plants[plantType].emoji[0]} {plantType.charAt(0).toUpperCase() + plantType.slice(1)} ({plants[plantType].cost} coins)
//             </Button>
//           ))}
//           <Button
//             onClick={() => {
//               const plot = plotsRef.current.find((p) => p.userData.plant && p.userData.stage < plants[p.userData.plantType].emoji.length - 1);
//               if (plot) waterPlant(plot);
//             }}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-lg"
//           >
//             💧 Water Plant
//           </Button>
//           <Button
//             onClick={() => {
//               const plot = plotsRef.current.find((p) => p.userData.plant && p.userData.stage === plants[p.userData.plantType].emoji.length - 1);
//               if (plot) harvestPlant(plot);
//             }}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-lg"
//           >
//             🌾 Harvest
//           </Button>
//           {currentLevel < levels.length && (
//             <Button
//               onClick={unlockNextLevel}
//               className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-lg"
//             >
//               🔓 Unlock Next Level ({levels[currentLevel].unlockCost} coins)
//             </Button>
//           )}
//         </div>

//         <div className="relative">
//           <canvas ref={canvasRef} className="w-full h-[400px] rounded-lg" />
//           <div className="absolute bottom-4 left-4 bg-green-800/80 text-white px-4 py-2 rounded">
//             {currentLevelData.name}
//           </div>
//         </div>

//         {plantedSeeds.length > 0 && (
//           <div className="bg-green-100/50 rounded-lg p-4 mt-6">
//             <h4 className="font-bold text-green-800 mb-2">Your Farm:</h4>
//             <div className="flex flex-wrap gap-2">
//               {plantedSeeds.map((seed, index) => (
//                 <span key={index} className="text-2xl animate-pulse">
//                   {plants[seed.type].emoji[seed.stage]}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="text-center mt-6">
//           <Button
//             onClick={endGame}
//             className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
//           >
//             <Sprout className="w-5 h-5 mr-2" />
//             End Farming
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };


import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ForestGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const ForestGame = ({ onGameComplete }: ForestGameProps) => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(50);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [plantedSeeds, setPlantedSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [startTime] = useState(Date.now());
  const { toast } = useToast();
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const plotsRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const growingPlantsRef = useRef(new Map());

  const plants = {
    carrot: {
      stages: [
        { geometry: new THREE.SphereGeometry(0.1, 16, 16), height: 0.2, scale: 1, color: 0x228b22, name: "Seed" },
        { geometry: new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16), height: 0.4, scale: 1, color: 0xffa500, name: "Carrot" },
      ],
      cost: 10,
      reward: 20,
      growthDuration: 2000,
    },
    sunflower: {
      stages: [
        { geometry: new THREE.SphereGeometry(0.1, 16, 16), height: 0.2, scale: 1, color: 0x228b22, name: "Seed" },
        { geometry: new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16), height: 0.7, scale: 1, color: 0xffff00, name: "Sunflower" },
      ],
      cost: 20,
      reward: 50,
      growthDuration: 3000,
    },
    tomato: {
      stages: [
        { geometry: new THREE.SphereGeometry(0.1, 16, 16), height: 0.2, scale: 1, color: 0x228b22, name: "Seed" },
        { geometry: new THREE.SphereGeometry(0.15, 16, 16), height: 0.3, scale: 1, color: 0xff0000, name: "Tomato" },
      ],
      cost: 30,
      reward: 80,
      growthDuration: 4000,
    },
  };

  const levels = [
    { id: 1, name: "Green Pastures", plots: 4, availablePlants: ["carrot"], unlockCost: 0 },
    { id: 2, name: "Golden Fields", plots: 6, availablePlants: ["carrot", "sunflower"], unlockCost: 150 },
    { id: 3, name: "Harvest Valley", plots: 8, availablePlants: ["carrot", "sunflower", "tomato"], unlockCost: 300 },
  ];

  const currentLevelData = levels.find((level) => level.id === currentLevel);

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 10, 20);

    const camera = new THREE.PerspectiveCamera(60, 800 / 400, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    const container = document.getElementById("canvas-container");
    if (container) {
      container.appendChild(renderer.domElement);
      console.log("Renderer appended to canvas-container");
    } else {
      console.error("Canvas container not found");
      return;
    }

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xfff8e1, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Add ground
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const groundGeometry = new THREE.PlaneGeometry(12, 12);
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add fences
    const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const fenceGeometry = new THREE.BoxGeometry(0.2, 0.5, 12);
    const fence1 = new THREE.Mesh(fenceGeometry, fenceMaterial);
    const fence2 = new THREE.Mesh(fenceGeometry, fenceMaterial);
    fence1.position.set(6, 0.25, 0);
    fence2.position.set(-6, 0.25, 0);
    fence1.castShadow = fence2.castShadow = true;
    scene.add(fence1, fence2);

    // Add plots
    plotsRef.current = [];
    for (let i = 0; i < currentLevelData.plots; i++) {
      const plotGeometry = new THREE.BoxGeometry(1, 0.1, 1);
      const plotMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
      const plot = new THREE.Mesh(plotGeometry, plotMaterial);
      plot.position.set((i % 4) * 2 - 3, 0.05, Math.floor(i / 4) * 2 - 2);
      plot.name = `plot${i}`;
      plot.userData = { plant: null, stage: 0, plantType: null };
      plot.receiveShadow = true;
      scene.add(plot);
      plotsRef.current.push(plot);
    }

    // Animation loop
    const animate = (time) => {
      requestAnimationFrame(animate);
      growingPlantsRef.current.forEach(({ plant, startTime, duration, targetStage, plantType }, plantId) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const { height: startHeight, scale: startScale } = plants[plantType].stages[targetStage - 1];
        const { height: endHeight, scale: endScale } = plants[plantType].stages[targetStage];
        plant.position.y = startHeight + (endHeight - startHeight) * progress;
        plant.scale.set(
          startScale + (endScale - startScale) * progress,
          startScale + (endScale - startScale) * progress,
          startScale + (endScale - startScale) * progress
        );
        plant.rotation.y += 0.005;
        if (progress === 1) {
          growingPlantsRef.current.delete(plantId);
          setPlantedSeeds((prev) =>
            prev.map((seed) => (seed.id === plantId ? { ...seed, stage: targetStage } : seed))
          );
        }
      });
      controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    // Click handler for planting
    const handleClick = (event) => {
      if (!selectedSeed || coins < plants[selectedSeed].cost) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(plotsRef.current);

      if (intersects.length > 0) {
        const plot = intersects[0].object;
        if (!plot.userData.plant) {
          plantSeed(plot, selectedSeed);
        }
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = 800 / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(800, 400);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      renderer.domElement.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
        console.log("Renderer removed from canvas-container");
      } else {
        console.warn("Renderer DOM element not removed; not a child of container or container not found");
      }
      renderer.dispose();
    };
  }, [currentLevel, selectedSeed]);

  const selectSeed = (plantType) => {
    setSelectedSeed(plantType);
    toast({
      title: `🌱 ${plantType.charAt(0).toUpperCase() + plantType.slice(1)} Selected`,
      description: `Click a plot to plant the seed!`,
      duration: 2000,
    });
    console.log(`Selected seed: ${plantType}`);
  };

  const plantSeed = (plot, plantType) => {
    if (plantedSeeds.length >= currentLevelData.plots) {
      toast({ title: "🚫 Plot Limit Reached", description: "All plots are occupied!", duration: 2000 });
      return;
    }

    setCoins((prev) => prev - plants[plantType].cost);
    const plantId = `plant${plantedSeeds.length + 1}`;
    setPlantedSeeds((prev) => [...prev, { id: plantId, plot: plot.name, type: plantType, stage: 0 }]);
    setScore((prev) => prev + 10);

    toast({
      title: "🌱 Seed Planted!",
      description: `You planted a ${plantType} in ${currentLevelData.name}!`,
      duration: 2000,
    });

    const { geometry, height, color } = plants[plantType].stages[0];
    const material = new THREE.MeshStandardMaterial({ color });
    const plant = new THREE.Mesh(geometry, material);
    plant.position.set(plot.position.x, height, plot.position.z);
    plant.castShadow = true;
    plant.name = plantId;
    sceneRef.current.add(plant);

    plot.userData = { plant, stage: 0, plantType };
    console.log(`Planted ${plantType} on plot ${plot.name}`);
  };

  const waterPlant = () => {
    const plot = plotsRef.current.find(
      (p) => p.userData.plant && p.userData.stage < plants[p.userData.plantType].stages.length - 1
    );
    if (!plot) {
      toast({ title: "🚫 No Plants to Water", description: "Plant seeds or wait for growth!", duration: 2000 });
      return;
    }

    const plantId = plot.userData.plant.name;
    const plantType = plot.userData.plantType;
    const newStage = plot.userData.stage + 1;

    toast({
      title: "💧 Watering Plant!",
      description: `Your ${plantType} is growing!`,
      duration: 2000,
    });

    sceneRef.current.remove(plot.userData.plant);
    const { geometry, height, color } = plants[plantType].stages[newStage];
    const material = new THREE.MeshStandardMaterial({ color });
    const newPlant = new THREE.Mesh(geometry, material);
    newPlant.position.set(plot.position.x, plants[plantType].stages[plot.userData.stage].height, plot.position.z);
    newPlant.castShadow = true;
    newPlant.name = plantId;
    sceneRef.current.add(newPlant);
    plot.userData.plant = newPlant;

    growingPlantsRef.current.set(plantId, {
      plant: newPlant,
      startTime: performance.now(),
      duration: plants[plantType].growthDuration,
      targetStage: newStage,
      plantType,
    });

    plot.userData.stage = newStage;
    setScore((prev) => prev + 20);
    console.log(`Watering ${plantType} on plot ${plot.name} to stage ${newStage}`);
    checkLevelComplete();
  };

  const harvestPlant = () => {
    const plot = plotsRef.current.find(
      (p) => p.userData.plant && p.userData.stage === plants[p.userData.plantType].stages.length - 1
    );
    if (!plot) {
      toast({ title: "🚫 No Plants to Harvest", description: "Wait for plants to fully grow!", duration: 2000 });
      return;
    }

    const plantId = plot.userData.plant.name;
    const plantType = plot.userData.plantType;
    setCoins((prev) => prev + plants[plantType].reward);
    setPlantedSeeds((prev) => prev.filter((seed) => seed.id !== plantId));
    setScore((prev) => prev + 30);

    toast({
      title: "🌾 Plant Harvested!",
      description: `You harvested a ${plantType} for ${plants[plantType].reward} coins!`,
      duration: 2000,
    });

    sceneRef.current.remove(plot.userData.plant);
    plot.userData = { plant: null, stage: 0, plantType: null };
    growingPlantsRef.current.delete(plantId);
    console.log(`Harvested ${plantType} from plot ${plot.name}`);
    checkLevelComplete();
  };

  const unlockNextLevel = () => {
    const nextLevel = levels.find((level) => level.id === currentLevel + 1);
    if (nextLevel && coins >= nextLevel.unlockCost) {
      setCoins((prev) => prev - nextLevel.unlockCost);
      setCurrentLevel(currentLevel + 1);
      setPlantedSeeds([]);
      setSelectedSeed(null);
      plotsRef.current.forEach((plot) => {
        if (plot.userData.plant) {
          sceneRef.current.remove(plot.userData.plant);
          plot.userData = { plant: null, stage: 0, plantType: null };
        }
      });
      growingPlantsRef.current.clear();
      toast({
        title: `🌟 Level Unlocked!`,
        description: `Welcome to ${nextLevel.name}!`,
        duration: 2000,
      });
      console.log(`Unlocked level ${nextLevel.id}: ${nextLevel.name}`);
    } else {
      toast({
        title: "🔒 Not Enough Coins!",
        description: `You need ${nextLevel.unlockCost} coins to unlock ${nextLevel.name}.`,
        duration: 2000,
      });
    }
  };

  const checkLevelComplete = () => {
    const allGrownAndHarvested =
      plantedSeeds.length === 0 && plotsRef.current.every((plot) => !plot.userData.plant);
    if (allGrownAndHarvested && currentLevel < levels.length) {
      toast({
        title: `🌾 Level ${currentLevel} Cleared!`,
        description: `Unlock ${levels.find((l) => l.id === currentLevel + 1).name} for ${levels.find((l) => l.id === currentLevel + 1).unlockCost} coins!`,
        duration: 2000,
      });
    } else if (allGrownAndHarvested && currentLevel === levels.length) {
      endGame();
    }
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    toast({
      title: "🚜 Harvest Haven Complete!",
      description: `You scored ${score} points and earned ${coins} coins!`,
      duration: 3000,
    });
    console.log(`Game ended with score ${score} and coins ${coins}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🌾</div>
        <h1 className="text-4xl font-bold text-green-800">Harvest Haven</h1>
        <p className="text-lg text-green-600">
          Select a seed, click plots to plant, water to grow, and harvest crops!
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-green-100/50 to-emerald-100/50">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-green-800">Score: {score} | Coins: {coins}</div>
          <div className="text-lg text-green-800">
            Plots: {plantedSeeds.length}/{currentLevelData.plots} | Level: {currentLevel}
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          {currentLevelData.availablePlants.map((plantType) => (
            <Button
              key={plantType}
              onClick={() => selectSeed(plantType)}
              disabled={coins < plants[plantType].cost}
              className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-lg ${coins < plants[plantType].cost ? "opacity-50 cursor-not-allowed" : ""} ${selectedSeed === plantType ? "ring-2 ring-green-800" : ""}`}
            >
              {plantType.charAt(0).toUpperCase() + plantType.slice(1)} ({plants[plantType].cost} coins)
            </Button>
          ))}
          <Button
            onClick={waterPlant}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-lg"
          >
            💧 Water Crop
          </Button>
          <Button
            onClick={harvestPlant}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-lg"
          >
            🌾 Harvest
          </Button>
          {currentLevel < levels.length && (
            <Button
              onClick={unlockNextLevel}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-lg"
            >
              🔓 Unlock Next Level ({levels[currentLevel].unlockCost} coins)
            </Button>
          )}
        </div>

        <div className="relative">
          <div id="canvas-container" className="w-full h-[400px] rounded-lg" />
          <div className="absolute bottom-4 left-4 bg-green-800/80 text-white px-4 py-2 rounded">
            {currentLevelData.name}
          </div>
          <div className="absolute top-4 left-4 bg-green-800/80 text-white px-4 py-2 rounded">
            Rotate: Drag | Plant: Select Seed & Click Plot | Water/Harvest: Click Buttons
          </div>
        </div>

        {plantedSeeds.length > 0 && (
          <div className="bg-green-100/50 rounded-lg p-4 mt-6">
            <h4 className="font-bold text-green-800 mb-2">Your Farm:</h4>
            <div className="flex flex-wrap gap-2">
              {plantedSeeds.map((seed, index) => (
                <span key={index} className="text-lg text-green-700">
                  {seed.type.charAt(0).toUpperCase() + seed.type.slice(1)} ({plants[seed.type].stages[seed.stage].name})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Button
            onClick={endGame}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            <Sprout className="w-5 h-5 mr-2" />
            End Farming
          </Button>
        </div>
      </Card>
    </div>
  );
};