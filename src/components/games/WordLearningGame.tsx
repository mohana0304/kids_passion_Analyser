import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Check, X, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WordLearningGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const WordLearningGame = ({ onGameComplete }: WordLearningGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [currentActivity, setCurrentActivity] = useState<'quiz' | 'puzzle' | 'wordFind'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameLevel, setGameLevel] = useState(1);
  const { toast } = useToast();

  const quizQuestions = [
    {
      question: "What sound does a cat make?",
      options: ["Meow", "Woof", "Moo", "Oink"],
      correct: "Meow",
      emoji: "🐱"
    },
    {
      question: "What color is the sun?",
      options: ["Blue", "Yellow", "Green", "Purple"],
      correct: "Yellow",
      emoji: "☀️"
    },
    {
      question: "How many legs does a spider have?",
      options: ["6", "8", "4", "10"],
      correct: "8",
      emoji: "🕷️"
    },
    {
      question: "What do bees make?",
      options: ["Milk", "Honey", "Cheese", "Butter"],
      correct: "Honey",
      emoji: "🐝"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: "4",
      emoji: "🔢"
    }
  ];

  const puzzleWords = [
    { word: "CAT", scrambled: "TAC", hint: "Furry pet that says meow" },
    { word: "DOG", scrambled: "GOD", hint: "Loyal pet that barks" },
    { word: "SUN", scrambled: "NUS", hint: "Bright light in the sky" },
    { word: "TREE", scrambled: "EETR", hint: "Tall plant with leaves" },
    { word: "BIRD", scrambled: "DIRB", hint: "Animal that can fly" }
  ];

  const wordFindGrid = [
    ['C', 'A', 'T', 'X', 'Y'],
    ['D', 'O', 'G', 'Z', 'W'],
    ['S', 'U', 'N', 'A', 'B'],
    ['F', 'I', 'S', 'H', 'C'],
    ['M', 'O', 'U', 'S', 'E']
  ];

  const findWords = ['CAT', 'DOG', 'SUN', 'FISH', 'MOUSE'];

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === quizQuestions[currentQuestion].correct;
    
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
        description: `The correct answer is ${quizQuestions[currentQuestion].correct}`,
        duration: 2000,
      });
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setCurrentActivity('puzzle');
        setCurrentQuestion(0);
      }
    }, 2000);
  };

  const handlePuzzleAnswer = (word: string) => {
    const correct = puzzleWords[currentQuestion].word;
    if (word === correct) {
      setScore(prev => prev + 30);
      toast({
        title: "🧩 Puzzle Solved!",
        description: "Amazing! You unscrambled the word!",
        duration: 2000,
      });
      
      setTimeout(() => {
        if (currentQuestion < puzzleWords.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          setCurrentActivity('wordFind');
          setCurrentQuestion(0);
        }
      }, 2000);
    }
  };

  const switchActivity = (activity: 'quiz' | 'puzzle' | 'wordFind') => {
    setCurrentActivity(activity);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
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
        <div className="text-6xl mb-4">{quizQuestions[currentQuestion].emoji}</div>
        <h3 className="text-2xl font-bold mb-4">{quizQuestions[currentQuestion].question}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {quizQuestions[currentQuestion].options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleQuizAnswer(option)}
            className={`p-6 text-lg h-auto ${
              selectedAnswer === option
                ? option === quizQuestions[currentQuestion].correct
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
        <h3 className="text-2xl font-bold mb-4">Unscramble the Word!</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Hint: {puzzleWords[currentQuestion].hint}
        </p>
        <div className="text-4xl font-bold text-learning mb-4">
          {puzzleWords[currentQuestion].scrambled}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={() => handlePuzzleAnswer(puzzleWords[currentQuestion].word)}
          className="bg-learning hover:bg-learning/90 px-8 py-4 text-xl"
        >
          {puzzleWords[currentQuestion].word}
        </Button>
      </div>
    </div>
  );

  const renderWordFind = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold mb-4">Find the Words!</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Find these words: {findWords.join(', ')}
        </p>
      </div>
      
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {wordFindGrid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <Button
              key={`${rowIndex}-${colIndex}`}
              variant="outline"
              className="w-12 h-12 text-lg font-bold"
            >
              {letter}
            </Button>
          ))
        )}
      </div>
      
      <div className="text-center">
        <Button
          onClick={() => {
            setScore(prev => prev + 50);
            toast({
              title: "🏆 Great Job!",
              description: "You found all the words!",
              duration: 2000,
            });
          }}
          className="bg-learning hover:bg-learning/90"
        >
          I Found Them All!
        </Button>
      </div>
    </div>
  );

  return (
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
          <div className="text-2xl font-bold text-learning">Score: {score}</div>
        </div>

        {/* Activity Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => switchActivity('quiz')}
            variant={currentActivity === 'quiz' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Quiz
          </Button>
          <Button
            onClick={() => switchActivity('puzzle')}
            variant={currentActivity === 'puzzle' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Puzzle
          </Button>
          <Button
            onClick={() => switchActivity('wordFind')}
            variant={currentActivity === 'wordFind' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Word Find
          </Button>
        </div>

        {/* Game Content */}
        {currentActivity === 'quiz' && renderQuiz()}
        {currentActivity === 'puzzle' && renderPuzzle()}
        {currentActivity === 'wordFind' && renderWordFind()}

        <div className="text-center mt-8">
          <Button
            onClick={endGame}
            className="bg-learning hover:bg-learning/90 text-learning-foreground px-8 py-3 text-lg"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Finish Learning
          </Button>
        </div>
      </Card>
    </div>
  );
};