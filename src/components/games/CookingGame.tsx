import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Check, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CookingGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const CookingGame = ({ onGameComplete }: CookingGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [currentRecipe, setCurrentRecipe] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [cookingStage, setCookingStage] = useState<'ingredients' | 'cooking' | 'complete'>('ingredients');
  const [cookingTime, setCookingTime] = useState(0);
  const [gameTimer, setGameTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();

  const recipes = [
    {
      name: "Fruit Salad",
      emoji: "🥗",
      ingredients: ["🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍓 Strawberry"],
      allIngredients: ["🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍓 Strawberry", "🥕 Carrot", "🧅 Onion", "🍞 Bread"],
      cookingTime: 3,
      difficulty: "Easy"
    },
    {
      name: "Vegetable Soup",
      emoji: "🍲",
      ingredients: ["🥕 Carrot", "🧅 Onion", "🥔 Potato", "🌶️ Pepper"],
      allIngredients: ["🥕 Carrot", "🧅 Onion", "🥔 Potato", "🌶️ Pepper", "🍎 Apple", "🍌 Banana", "🍞 Bread"],
      cookingTime: 5,
      difficulty: "Medium"
    },
    {
      name: "Sandwich",
      emoji: "🥪",
      ingredients: ["🍞 Bread", "🧀 Cheese", "🍅 Tomato", "🥬 Lettuce"],
      allIngredients: ["🍞 Bread", "🧀 Cheese", "🍅 Tomato", "🥬 Lettuce", "🥕 Carrot", "🧅 Onion", "🍎 Apple"],
      cookingTime: 2,
      difficulty: "Easy"
    },
    {
      name: "Pasta",
      emoji: "🍝",
      ingredients: ["🍝 Pasta", "🍅 Tomato", "🧀 Cheese", "🌿 Herbs"],
      allIngredients: ["🍝 Pasta", "🍅 Tomato", "🧀 Cheese", "🌿 Herbs", "🥕 Carrot", "🧅 Onion", "🍞 Bread"],
      cookingTime: 4,
      difficulty: "Medium"
    },
    {
      name: "Pancakes",
      emoji: "🥞",
      ingredients: ["🥞 Flour", "🥛 Milk", "🥚 Egg", "🍯 Honey"],
      allIngredients: ["🥞 Flour", "🥛 Milk", "🥚 Egg", "🍯 Honey", "🍞 Bread", "🧀 Cheese", "🍅 Tomato"],
      cookingTime: 3,
      difficulty: "Easy"
    }
  ];

  const currentRecipeData = recipes[currentRecipe];

  // Game timer logic
  useEffect(() => {
    if (cookingStage === 'ingredients' && gameTimer > 0 && !gameOver) {
      const timer = setInterval(() => {
        setGameTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (gameTimer === 0 && cookingStage === 'ingredients') {
      setGameOver(true);
      toast({
        title: "⏰ Time's Up!",
        description: `Game Over! Your final score: ${score}`,
        duration: 3000,
      });
    }
  }, [gameTimer, cookingStage, gameOver]);

  // Cooking timer logic
  useEffect(() => {
    if (cookingStage === 'cooking' && cookingTime > 0) {
      const timer = setInterval(() => {
        setCookingTime((prev) => {
          if (prev <= 1) {
            setCookingStage('complete');
            setScore((prevScore) => prevScore + 30);
            toast({
              title: "🍳 Cooking Complete!",
              description: `Your ${currentRecipeData.name} is ready!`,
              duration: 3000,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cookingStage, cookingTime]);

  const handleIngredientSelect = (ingredient: string) => {
    if (gameOver || cookingStage !== 'ingredients') return;
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients((prev) => prev.filter((i) => i !== ingredient));
    } else {
      setSelectedIngredients((prev) => [...prev, ingredient]);
      if (currentRecipeData.ingredients.includes(ingredient)) {
        toast({
          title: "✅ Good Choice!",
          description: `${ingredient} is correct!`,
          duration: 1000,
        });
      } else {
        setScore((prev) => prev - 10);
        toast({
          title: "❌ Wrong Ingredient!",
          description: `${ingredient} doesn't belong in this recipe.`,
          duration: 1000,
        });
      }
    }
  };

  const checkIngredients = () => {
    const correctIngredients = currentRecipeData.ingredients;
    const isCorrect =
      correctIngredients.every((ing) => selectedIngredients.includes(ing)) &&
      selectedIngredients.every((ing) => correctIngredients.includes(ing));

    if (isCorrect) {
      setScore((prev) => prev + 50);
      setCookingStage('cooking');
      setCookingTime(currentRecipeData.cookingTime);
      toast({
        title: "🎉 Perfect Ingredients!",
        description: "Now let's cook it!",
        duration: 2000,
      });
    } else {
      setScore((prev) => prev - 20);
      toast({
        title: "😕 Check Your Ingredients",
        description: "Some ingredients are missing or wrong.",
        duration: 2000,
      });
    }
  };

  const nextRecipe = () => {
    if (currentRecipe < recipes.length - 1) {
      setCurrentRecipe((prev) => prev + 1);
      setSelectedIngredients([]);
      setCookingStage('ingredients');
      setCookingTime(0);
      setGameTimer(60);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    toast({
      title: "👨‍🍳 Cooking Master!",
      description: `You scored ${score} points in ${timeSpent.toFixed(1)} seconds!`,
      duration: 3000,
    });
  };

  const restartGame = () => {
    setScore(0);
    setCurrentRecipe(0);
    setSelectedIngredients([]);
    setCookingStage('ingredients');
    setCookingTime(0);
    setGameTimer(60);
    setGameOver(false);
  };

  const renderIngredientSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">{currentRecipeData.emoji}</div>
        <h3 className="text-2xl font-bold mb-2">{currentRecipeData.name}</h3>
        <div className="flex justify-center items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">{currentRecipeData.difficulty}</span>
        </div>
        <p className="text-lg text-muted-foreground mb-4">
          Select the correct ingredients (Time: {gameTimer}s):
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {currentRecipeData.allIngredients.map((ingredient, index) => (
          <Button
            key={index}
            onClick={() => handleIngredientSelect(ingredient)}
            className={`p-4 text-lg h-auto ${
              selectedIngredients.includes(ingredient)
                ? currentRecipeData.ingredients.includes(ingredient)
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-cooking/20 hover:bg-cooking/30 text-cooking'
            }`}
            disabled={gameOver}
          >
            {ingredient}
          </Button>
        ))}
      </div>
      <div className="text-center">
        <Button
          onClick={checkIngredients}
          className="bg-cooking hover:bg-cooking/90 text-cooking-foreground px-8 py-3"
          disabled={selectedIngredients.length === 0 || gameOver}
        >
          <Check className="w-5 h-5 mr-2" />
          Check Ingredients
        </Button>
      </div>
    </div>
  );

  const renderCooking = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-2xl font-bold mb-4">Cooking {currentRecipeData.name}...</h3>
        <div className="flex justify-center items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-cooking" />
          <span className="text-3xl font-bold text-cooking">{cookingTime}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-cooking h-4 rounded-full transition-all duration-1000"
            style={{ width: `${100 - (cookingTime / currentRecipeData.cookingTime) * 100}%` }}
          ></div>
        </div>
        <p className="text-lg text-muted-foreground">
          Please wait while your food is cooking...
        </p>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">{currentRecipeData.emoji}</div>
        <h3 className="text-2xl font-bold mb-4">
          {currentRecipeData.name} is Ready! 🎉
        </h3>
        <p className="text-lg text-muted-foreground mb-4">
          Delicious! You're becoming a great chef!
        </p>
        <div className="text-3xl mb-4">⭐⭐⭐⭐⭐</div>
      </div>
      <div className="text-center">
        <Button
          onClick={nextRecipe}
          className="bg-cooking hover:bg-cooking/90 text-cooking-foreground px-8 py-3"
        >
          {currentRecipe < recipes.length - 1 ? 'Next Recipe' : 'Finish Cooking'}
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
          className="bg-cooking hover:bg-cooking/90 text-cooking-foreground px-8 py-3"
        >
          Restart Game
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🍳</div>
        <h1 className="text-4xl font-bold text-cooking">Cooking Game</h1>
        <p className="text-lg text-muted-foreground">
          Cook delicious meals before time runs out!
        </p>
      </div>
      <Card className="p-8 bg-gradient-to-br from-cooking/10 to-cooking/20">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-cooking">Score: {score}</div>
          <div className="text-sm text-muted-foreground">
            Recipe {currentRecipe + 1} of {recipes.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-cooking h-2 rounded-full"
              style={{ width: `${((currentRecipe + 1) / recipes.length) * 100}%` }}
            ></div>
          </div>
        </div>
        {gameOver ? renderGameOver() : (
          <>
            {cookingStage === 'ingredients' && renderIngredientSelection()}
            {cookingStage === 'cooking' && renderCooking()}
            {cookingStage === 'complete' && renderComplete()}
          </>
        )}
        <div className="text-center mt-8">
          <Button
            onClick={endGame}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Finish Cooking Session
          </Button>
        </div>
      </Card>
    </div>
  );
};