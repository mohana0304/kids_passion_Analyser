import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Check, X, Shuffle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WordLearningGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const WordLearningGame = ({ onGameComplete }: WordLearningGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [currentMode, setCurrentMode] = useState<'quiz' | 'puzzle' | 'word'>('quiz');
  const [gameLevel, setGameLevel] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [cards, setCards] = useState<{ id: number; content: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [userInput, setUserInput] = useState("");
  const [selectedPositions, setSelectedPositions] = useState<[number, number][]>([]);
  const [foundPositions, setFoundPositions] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);
  const { toast } = useToast();

  // Quiz Data - 10 progressively harder questions
  const quizQuestions = [
    {
      question: "What is 1 + 1?",
      options: ["1", "2", "3", "4"],
      correct: "2",
      emoji: "🔢"
    },
    {
      question: "What color is an apple?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correct: "Red",
      emoji: "🍎"
    },
    {
      question: "How many fingers on one hand?",
      options: ["4", "5", "6", "7"],
      correct: "5",
      emoji: "✋"
    },
    {
      question: "What animal says 'quack'?",
      options: ["Duck", "Cat", "Dog", "Cow"],
      correct: "Duck",
      emoji: "🦆"
    },
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correct: "Paris",
      emoji: "🇫🇷"
    },
    {
      question: "What is 5 x 5?",
      options: ["20", "25", "30", "35"],
      correct: "25",
      emoji: "🔢"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
      correct: "Leonardo da Vinci",
      emoji: "🖼️"
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Jupiter", "Earth", "Mars", "Saturn"],
      correct: "Jupiter",
      emoji: "🪐"
    },
    {
      question: "What is H2O?",
      options: ["Water", "Oxygen", "Hydrogen", "Carbon Dioxide"],
      correct: "Water",
      emoji: "💧"
    },
    {
      question: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
      correct: "8",
      emoji: "🧮"
    }
  ];

  // Puzzle Data for Matching Pairs - Emojis for pairs
  const pairEmojis = ["🍎", "🍌", "🍇", "🍊", "🍒", "🍑", "🍐", "🥭", "🥝", "🍋", "🐱", "🐶", "🐦", "🐟", "🦁"];

  // Word Game Data
  // Unscramble for levels 1-3
  const unscrambleData = [
    { word: "CAT", scrambled: "TAC", hint: "Furry pet that says meow", theme: "animals" },
    { word: "APPLE", scrambled: "PPELA", hint: "Red or green fruit", theme: "fruits" },
    { word: "PARK", scrambled: "KARP", hint: "Place to play outside", theme: "places" }
  ];

  // Word Search for levels 4-6
  const wordSearchData = [
    {
      grid: [
        ['P', 'Y', 'D', 'X', 'S', 'U', 'W', 'Z'],
        ['B', 'A', 'N', 'A', 'N', 'A', 'Q', 'L'],
        ['B', 'F', 'O', 'R', 'E', 'S', 'T', 'K'],
        ['Q', 'S', 'C', 'H', 'O', 'O', 'L', 'E']
      ],
      findWords: ['SCHOOL', 'BANANA', 'FOREST']
    },
    {
      grid: [
        ['L', 'A', 'K', 'E', 'L', 'I', 'W', 'V', 'G'],
        ['N', 'J', 'K', 'O', 'B', 'I', 'R', 'D', 'L'],
        ['F', 'G', 'R', 'A', 'P', 'E', 'Z', 'X', 'X'],
        ['D', 'D', 'I', 'F', 'O', 'R', 'E', 'S', 'T'],
        ['U', 'M', 'J', 'G', 'O', 'Y', 'L', 'V', 'L']
      ],
      findWords: ['BIRD', 'FOREST', 'LAKE', 'GRAPE']
    },
    {
      grid: [
        ['C', 'M', 'G', 'A', 'W', 'W', 'L', 'T'],
        ['T', 'E', 'F', 'N', 'H', 'O', 'M', 'E'],
        ['I', 'K', 'I', 'W', 'I', 'I', 'R', 'O'],
        ['X', 'J', 'I', 'Q', 'V', 'Q', 'M', 'Y'],
        ['H', 'C', 'D', 'J', 'C', 'A', 'T', 'F'],
        ['T', 'Q', 'G', 'T', 'I', 'G', 'E', 'R'],
        ['B', 'N', 'L', 'B', 'E', 'A', 'R', 'X']
      ],
      findWords: ['HOME', 'TIGER', 'KIWI', 'CAT', 'BEAR']
    }
  ];

  // Fill-in-the-blank for levels 7-10
  const fillBlankData = [
    { sentence: "The ___ is man's best friend.", correct: "DOG", hint: "Animal that barks", theme: "animals" },
    { sentence: "___ is a yellow fruit that monkeys love.", correct: "BANANA", hint: "Curved fruit", theme: "fruits" },
    { sentence: "The Eiffel Tower is in ___.", correct: "PARIS", hint: "Capital city", theme: "places" },
    { sentence: "The king of the jungle is the ___.", correct: "LION", hint: "Big cat with mane", theme: "animals" }
  ];

  useEffect(() => {
    if (currentMode === 'puzzle') {
      const pairCount = Math.min(gameLevel + 1, 10);
      const selectedEmojis = pairEmojis.slice(0, pairCount);
      const shuffledCards = [...selectedEmojis, ...selectedEmojis]
        .sort(() => Math.random() - 0.5)
        .map((content, index) => ({ id: index, content, flipped: false, matched: false }));
      setCards(shuffledCards);
      setFlippedIds([]);
      setMatchedIds([]);
    }
  }, [gameLevel, currentMode]);

  useEffect(() => {
    if (flippedIds.length === 2) {
      const [firstId, secondId] = flippedIds;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      if (firstCard?.content === secondCard?.content) {
        setMatchedIds(prev => [...prev, firstId, secondId]);
        setScore(prev => prev + 20 * (gameLevel + 1));
        toast({
          title: "🎉 Match Found!",
          description: "Great job!",
          duration: 1000,
        });
      } else {
        setTimeout(() => setFlippedIds([]), 1500);
        toast({
          title: "Not a Match",
          description: "Try again!",
          duration: 1000,
        });
      }
    }
  }, [flippedIds, cards]);

  useEffect(() => {
    if (matchedIds.length === cards.length && cards.length > 0) {
      toast({
        title: "🧩 Level Complete!",
        description: "All pairs matched!",
        duration: 2000,
      });
      setTimeout(() => nextLevel(), 2000);
    }
  }, [matchedIds, cards]);

  const nextLevel = () => {
    setSelectedPositions([]);
    setFoundPositions(new Set());
    setFoundWords(new Set());
    if (gameLevel < 10) {
      setGameLevel(prev => prev + 1);
    } else {
      setGameCompleted(true);
      toast({
        title: "🏆 Mode Complete!",
        description: `You finished all levels in ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} with score ${score}!`,
        duration: 3000,
      });
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === quizQuestions[gameLevel - 1].correct;
    
    if (isCorrect) {
      setScore(prev => prev + 20);
      toast({
        title: "🎉 Correct!",
        description: "Great job! You got it right!",
        duration: 2000,
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer is ${quizQuestions[gameLevel - 1].correct}`,
        duration: 2000,
      });
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      nextLevel();
    }, 2000);
  };

  const handleFlip = (id: number) => {
    console.log("Flipping card:", id);
    if (flippedIds.length === 2 || flippedIds.includes(id) || matchedIds.includes(id)) return;
    setFlippedIds(prev => [...prev, id]);
  };

  const handleUnscrambleSubmit = () => {
    console.log("Unscramble submitted:", userInput);
    const levelIndex = gameLevel - 1;
    const correct = unscrambleData[levelIndex].word;
    if (userInput.toUpperCase() === correct) {
      setScore(prev => prev + 30);
      toast({
        title: "🧩 Unscrambled!",
        description: "Amazing!",
        duration: 2000,
      });
      setTimeout(() => {
        setUserInput("");
        nextLevel();
      }, 2000);
    } else {
      toast({
        title: "Not quite",
        description: `Try again! Hint: ${unscrambleData[levelIndex].hint}`,
        duration: 2000,
      });
    }
  };

  const handleFillSubmit = () => {
    console.log("Fill submitted:", userInput);
    const levelIndex = gameLevel - 7;
    const correct = fillBlankData[levelIndex].correct;
    if (userInput.toUpperCase() === correct) {
      setScore(prev => prev + 30);
      toast({
        title: "📝 Filled Correctly!",
        description: "Well done!",
        duration: 2000,
      });
      setTimeout(() => {
        setUserInput("");
        nextLevel();
      }, 2000);
    } else {
      toast({
        title: "Not quite",
        description: `Try again! Hint: ${fillBlankData[levelIndex].hint}`,
        duration: 2000,
      });
    }
  };

  const handleLetterClick = (row: number, col: number) => {
    const pos: [number, number] = [row, col];
    const posStr = `${row}-${col}`;
    if (foundPositions.has(posStr)) return;

    const newSelected = [...selectedPositions, pos];

    // Check adjacency
    if (selectedPositions.length > 0) {
      const last = selectedPositions[selectedPositions.length - 1];
      const dr = Math.abs(row - last[0]);
      const dc = Math.abs(col - last[1]);
      if (dr > 1 || dc > 1) {
        setSelectedPositions([]);
        return;
      }
    }

    // Check consistent direction for length >=3
    if (newSelected.length >= 3) {
      const dx = newSelected[1][1] - newSelected[0][1];
      const dy = newSelected[1][0] - newSelected[0][0];
      const currDx = newSelected[newSelected.length - 1][1] - newSelected[newSelected.length - 2][1];
      const currDy = newSelected[newSelected.length - 1][0] - newSelected[newSelected.length - 2][0];
      if (currDx !== dx || currDy !== dy) {
        setSelectedPositions([]);
        return;
      }
    }

    setSelectedPositions(newSelected);

    // Get letters
    const levelIndex = gameLevel - 4;
    const grid = wordSearchData[levelIndex].grid;
    const selectedLetters = newSelected.map(([r, c]) => grid[r][c]).join('');

    // Check match
    const possibleWords = wordSearchData[levelIndex].findWords.filter(w => !foundWords.has(w));
    let matched = '';
    for (const word of possibleWords) {
      const rev = word.split('').reverse().join('');
      if (selectedLetters === word || selectedLetters === rev) {
        matched = word;
        break;
      }
    }

    if (matched) {
      const newFoundPos = new Set(newSelected.map(([r, c]) => `${r}-${c}`));
      setFoundPositions(prev => new Set([...prev, ...newFoundPos]));
      setFoundWords(prev => new Set([...prev, matched]));
      setScore(prev => prev + 10 * matched.length);
      toast({
        title: "🎉 Word Found!",
        description: matched,
        duration: 2000,
      });
      setSelectedPositions([]);
    }
  };

  const handleWordFindComplete = () => {
    console.log("Word find completed");
    const levelIndex = gameLevel - 4;
    if (foundWords.size === wordSearchData[levelIndex].findWords.length) {
      toast({
        title: "🏆 Great Job!",
        description: "You found all the words!",
        duration: 2000,
      });
      setTimeout(nextLevel, 2000);
    }
  };

  const switchMode = (mode: 'quiz' | 'puzzle' | 'word') => {
    setCurrentMode(mode);
    setGameLevel(1);
    setScore(0);
    setSelectedAnswer(null);
    setUserInput("");
    setCards([]);
    setFlippedIds([]);
    setMatchedIds([]);
    setSelectedPositions([]);
    setFoundPositions(new Set());
    setFoundWords(new Set());
    setGameCompleted(false);
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    
    toast({
      title: "📚 Learning Complete!",
      description: `You scored ${score} points! Keep learning!`,
      duration: 3000,
    });
  };

  const renderQuiz = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">{quizQuestions[gameLevel - 1].emoji}</div>
        <h3 className="text-2xl font-bold mb-4">{quizQuestions[gameLevel - 1].question}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {quizQuestions[gameLevel - 1].options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleQuizAnswer(option)}
            className={`p-6 text-lg h-auto ${
              selectedAnswer === option
                ? option === quizQuestions[gameLevel - 1].correct
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
                : 'bg-learning hover:bg-learning/90'
            }`}
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderPuzzle = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🧩</div>
        <h3 className="text-2xl font-bold mb-4">Match the Pairs! Level {gameLevel}</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {cards.map(card => (
          <div
            key={card.id}
            style={{ perspective: '1000px' }}
            className="relative h-20 w-20 cursor-pointer"
            onClick={() => handleFlip(card.id)}
          >
            <div
              style={{
                transition: 'transform 0.5s',
                transformStyle: 'preserve-3d',
                transform: (flippedIds.includes(card.id) || matchedIds.includes(card.id)) ? 'rotateY(180deg)' : 'none'
              }}
              className="absolute inset-0"
            >
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="absolute inset-0 bg-gray-300 flex items-center justify-center text-4xl"
              >
                ?
              </div>
              <div
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                className="absolute inset-0 bg-learning flex items-center justify-center text-4xl"
              >
                {card.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWord = () => {
    if (gameLevel <= 3) {
      // Unscramble
      const levelIndex = gameLevel - 1;
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔀</div>
            <h3 className="text-2xl font-bold mb-4">Unscramble the Word! Level {gameLevel}</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Hint: {unscrambleData[levelIndex].hint}
            </p>
            <div className="text-4xl font-bold text-learning mb-4">
              {unscrambleData[levelIndex].scrambled}
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Input
              value={userInput}
              onChange={e => setUserInput(e.target.value.toUpperCase())}
              placeholder="Enter the word"
              className="max-w-xs"
            />
            <Button
              onClick={handleUnscrambleSubmit}
              className="bg-learning hover:bg-learning/90"
            >
              Submit
            </Button>
          </div>
        </div>
      );
    } else if (gameLevel <= 6) {
      // Word Search
      const levelIndex = gameLevel - 4;
      const currentGrid = wordSearchData[levelIndex].grid;
      const cols = currentGrid[0].length;
      const findWordsList = wordSearchData[levelIndex].findWords;
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-4">Find the Words! Level {gameLevel}</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Find these words: {findWordsList.map((word, i) => (
                <span key={word}>
                  {i > 0 && ', '}
                  {foundWords.has(word) ? <s>{word}</s> : word}
                </span>
              ))}
            </p>
          </div>
          
          <div 
            className="grid gap-2 max-w-md mx-auto"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {currentGrid.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  variant="outline"
                  className={`w-12 h-12 text-lg font-bold ${
                    foundPositions.has(`${rowIndex}-${colIndex}`) ? 'bg-green-500 hover:bg-green-500 text-white' :
                    selectedPositions.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-yellow-500 hover:bg-yellow-500 text-white' :
                    'hover:bg-gray-100'
                  }`}
                  onClick={() => handleLetterClick(rowIndex, colIndex)}
                >
                  {letter}
                </Button>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button
              onClick={handleWordFindComplete}
              disabled={foundWords.size < findWordsList.length}
              className="bg-learning hover:bg-learning/90"
            >
              I Found Them All!
            </Button>
          </div>
        </div>
      );
    } else {
      // Fill in the Blank
      const levelIndex = gameLevel - 7;
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4">Fill in the Blank! Level {gameLevel}</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Hint: {fillBlankData[levelIndex].hint}
            </p>
            <div className="text-2xl mb-4">
              {fillBlankData[levelIndex].sentence.replace(`___`, `____`)}
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Input
              value={userInput}
              onChange={e => setUserInput(e.target.value.toUpperCase())}
              placeholder="Enter the word"
              className="max-w-xs"
            />
            <Button
              onClick={handleFillSubmit}
              className="bg-learning hover:bg-learning/90"
            >
              Submit
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('assert/learning-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">📚</div>
          <h1 className="text-4xl font-bold text-learning">Word & Learning Game</h1>
          <p className="text-lg text-muted-foreground">
            Learn new words and test your knowledge!
          </p>
        </div>

        <Card className="p-8 bg-gradient-to-br from-learning/10 to-learning/20">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-learning">Score: {score} | Level: {gameLevel}</div>
          </div>

          {gameCompleted ? (
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-green-600">Congratulations!</h2>
              <p className="text-2xl">You completed all levels in {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} mode with a final score of {score}!</p>
              <Button
                onClick={endGame}
                className="bg-learning hover:bg-learning/90 text-learning-foreground px-8 py-3 text-lg"
              >
                Finish Game
              </Button>
            </div>
          ) : (
            <>
              {/* Mode Selector */}
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  onClick={() => switchMode('quiz')}
                  variant={currentMode === 'quiz' ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Quiz
                </Button>
                <Button
                  onClick={() => switchMode('puzzle')}
                  variant={currentMode === 'puzzle' ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Puzzle
                </Button>
                <Button
                  onClick={() => switchMode('word')}
                  variant={currentMode === 'word' ? 'default' : 'outline'}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Word
                </Button>
              </div>

              {/* Game Content */}
              {currentMode === 'quiz' && renderQuiz()}
              {currentMode === 'puzzle' && renderPuzzle()}
              {currentMode === 'word' && renderWord()}

              <div className="text-center mt-8">
                <Button
                  onClick={endGame}
                  className="bg-learning hover:bg-learning/90 text-learning-foreground px-8 py-3 text-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Finish Learning
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};