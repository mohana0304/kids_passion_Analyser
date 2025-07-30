import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Piano, Drum, Guitar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MusicGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const MusicGame = ({ onGameComplete }: MusicGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [currentNote, setCurrentNote] = useState<number | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const { toast } = useToast();

  const notes = [
    { key: "C", color: "bg-red-400", sound: "Do" },
    { key: "D", color: "bg-orange-400", sound: "Re" },
    { key: "E", color: "bg-yellow-400", sound: "Mi" },
    { key: "F", color: "bg-green-400", sound: "Fa" },
    { key: "G", color: "bg-blue-400", sound: "Sol" },
    { key: "A", color: "bg-indigo-400", sound: "La" },
    { key: "B", color: "bg-purple-400", sound: "Ti" }
  ];

  const playNote = (index: number) => {
    setCurrentNote(index);
    setScore(prev => prev + 10);
    
    // Create and play audio tone
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Musical frequencies for each note
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C, D, E, F, G, A, B
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[index];
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Play sound feedback
    toast({
      title: `♪ ${notes[index].sound} ♪`,
      description: "Great job! Keep playing!",
      duration: 1000,
    });

    setTimeout(() => setCurrentNote(null), 200);
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    
    toast({
      title: "🎵 Music Game Complete!",
      description: `You scored ${score} points! You have musical talent!`,
      duration: 3000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🎵</div>
        <h1 className="text-4xl font-bold text-music">Music Game</h1>
        <p className="text-lg text-muted-foreground">
          Play the colorful piano keys and create beautiful music!
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-music/10 to-music/20">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-music">Score: {score}</div>
        </div>

        {/* Virtual Piano */}
        <div className="flex justify-center space-x-2 mb-8">
          {notes.map((note, index) => (
            <Button
              key={note.key}
              onClick={() => playNote(index)}
              className={`
                w-16 h-32 ${note.color} text-white font-bold text-lg
                transform transition-all duration-150
                ${currentNote === index ? 'scale-95 shadow-lg' : 'hover:scale-105'}
                border-2 border-white shadow-md
              `}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl">{note.key}</span>
                <span className="text-xs">{note.sound}</span>
              </div>
            </Button>
          ))}
        </div>

        {/* Instruments */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button
            onClick={() => setScore(prev => prev + 5)}
            className="bg-music/20 hover:bg-music/30 text-music p-4 h-20"
          >
            <Piano className="w-8 h-8 mr-2" />
            Piano
          </Button>
          <Button
            onClick={() => setScore(prev => prev + 5)}
            className="bg-music/20 hover:bg-music/30 text-music p-4 h-20"
          >
            <Drum className="w-8 h-8 mr-2" />
            Drums
          </Button>
          <Button
            onClick={() => setScore(prev => prev + 5)}
            className="bg-music/20 hover:bg-music/30 text-music p-4 h-20"
          >
            <Guitar className="w-8 h-8 mr-2" />
            Guitar
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={endGame}
            className="bg-music hover:bg-music/90 text-music-foreground px-8 py-3 text-lg"
          >
            <Music className="w-5 h-5 mr-2" />
            Finish Music Session
          </Button>
        </div>
      </Card>
    </div>
  );
};