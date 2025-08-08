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
  const [selectedInstrument, setSelectedInstrument] = useState<'piano' | 'guitar' | 'drums' | 'trumpet' | 'violin' | null>(null);
  const { toast } = useToast();

  // Instrument note sets and sample songs
  const instrumentData = {
    piano: {
      notes: [
        { key: "C", color: "bg-red-400", sound: "Do", freq: 261.63 },
        { key: "D", color: "bg-orange-400", sound: "Re", freq: 293.66 },
        { key: "E", color: "bg-yellow-400", sound: "Mi", freq: 329.63 },
        { key: "F", color: "bg-green-400", sound: "Fa", freq: 349.23 },
        { key: "G", color: "bg-blue-400", sound: "Sol", freq: 392.00 },
        { key: "A", color: "bg-indigo-400", sound: "La", freq: 440.00 },
        { key: "B", color: "bg-purple-400", sound: "Ti", freq: 493.88 },
      ],
      sample: {
        name: "Twinkle Star",
        notes: [0,0,4,4,5,5,4,3,3,2,2,1,1,0], // C C G G A A G F F E E D D C
        display: "C C G G A A G  F F E E D D C"
      },
      oscType: 'sine',
    },
    guitar: {
      notes: [
        { key: "E", color: "bg-yellow-700", sound: "E", freq: 329.63 },
        { key: "A", color: "bg-orange-700", sound: "A", freq: 440.00 },
        { key: "D", color: "bg-green-700", sound: "D", freq: 587.33 },
        { key: "G", color: "bg-blue-700", sound: "G", freq: 783.99 },
        { key: "B", color: "bg-purple-700", sound: "B", freq: 987.77 },
        { key: "E'", color: "bg-pink-700", sound: "E'", freq: 1318.51 },
      ],
      sample: {
        name: "Simple Riff",
        notes: [0,1,2,3,4,5,0,5], // E A D G B E' E E'
        display: "E A D G B E' E E'"
      },
      oscType: 'triangle',
    },
    drums: {
      notes: [
        { key: "Kick", color: "bg-gray-700", sound: "Kick", freq: 60 },
        { key: "Snare", color: "bg-red-700", sound: "Snare", freq: 220 },
        { key: "HiHat", color: "bg-yellow-300", sound: "HiHat", freq: 8000 },
        { key: "Tom", color: "bg-blue-700", sound: "Tom", freq: 130 },
        { key: "Clap", color: "bg-pink-400", sound: "Clap", freq: 2000 },
      ],
      sample: {
        name: "Basic Beat",
        notes: [0,2,1,2,0,2,1,2], // Kick HiHat Snare HiHat ...
        display: "Kick HiHat Snare HiHat Kick HiHat Snare HiHat"
      },
      oscType: 'square',
    },
    trumpet: {
      notes: [
        { key: "C", color: "bg-yellow-400", sound: "C", freq: 261.63 },
        { key: "D", color: "bg-orange-400", sound: "D", freq: 293.66 },
        { key: "E", color: "bg-green-400", sound: "E", freq: 329.63 },
        { key: "F", color: "bg-blue-400", sound: "F", freq: 349.23 },
        { key: "G", color: "bg-purple-400", sound: "G", freq: 392.00 },
      ],
      sample: {
        name: "Trumpet Call",
        notes: [0,2,4,0,4,2,0], // C E G C G E C
        display: "C E G C G E C"
      },
      oscType: 'sawtooth',
    },
    violin: {
      notes: [
        { key: "G", color: "bg-green-300", sound: "G", freq: 196.00 },
        { key: "D", color: "bg-blue-300", sound: "D", freq: 293.66 },
        { key: "A", color: "bg-yellow-300", sound: "A", freq: 440.00 },
        { key: "E", color: "bg-pink-300", sound: "E", freq: 659.25 },
      ],
      sample: {
        name: "Violin Tune",
        notes: [0,0,1,1,2,2,3,3], // G G D D A A E E
        display: "G G D D A A E E"
      },
      oscType: 'triangle',
    },
  };

  // Play note for selected instrument
  const playNote = (index: number) => {
    if (!selectedInstrument) return;
    setCurrentNote(index);
    setScore(prev => prev + 10);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const { notes, oscType } = instrumentData[selectedInstrument];
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = notes[index].freq;
    oscillator.type = oscType;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    toast({
      title: `♪ ${notes[index].sound} ♪`,
      description: "Great job! Keep playing!",
      duration: 1000,
    });
    setTimeout(() => setCurrentNote(null), 200);
  };

  // Play sample song for selected instrument
  const playSample = () => {
    if (!selectedInstrument) return;
    const { notes, sample, oscType } = instrumentData[selectedInstrument];
    let i = 0;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    function playNext() {
      if (i >= sample.notes.length) return;
      const idx = sample.notes[i];
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = notes[idx].freq;
      oscillator.type = oscType;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      setCurrentNote(idx);
      setTimeout(() => {
        setCurrentNote(null);
        i++;
        playNext();
      }, 350);
    }
    playNext();
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    toast({
      title: "𝄞♫⋆｡♪˚♬ ﾟ Music Game Complete!",
      description: `You scored ${score} points! You have musical talent!`,
      duration: 3000,
    });
  };

  return (
    <div 
      className="w-full min-h-screen relative"
      style={{
        backgroundImage: 'url(/music-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🎵</div>
          <h1 className="text-4xl font-bold text-music drop-shadow-lg">Music Game</h1>
          <p className="text-lg text-muted-foreground drop-shadow-md">
            {selectedInstrument ? `Play the ${selectedInstrument} keys and try the sample song!` : 'Choose your instrument to start!'}
          </p>
        </div>
        <Card className="p-8 bg-white/80 backdrop-blur-md border-2 border-music/20 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-music">Score: {score}</div>
        </div>
        {/* Instruments */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button onClick={() => setSelectedInstrument('piano')} className={`bg-music/20 hover:bg-music/30 text-music p-4 h-20 flex items-center justify-center ${selectedInstrument === 'piano' ? 'ring-2 ring-music' : ''}`}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 mr-2 text-2xl">🎹</span>
            Piano
          </Button>
          <Button onClick={() => setSelectedInstrument('drums')} className={`bg-music/20 hover:bg-music/30 text-music p-4 h-20 flex items-center justify-center ${selectedInstrument === 'drums' ? 'ring-2 ring-music' : ''}`}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 mr-2 text-2xl">🥁</span>
            Drums
          </Button>
          <Button onClick={() => setSelectedInstrument('guitar')} className={`bg-music/20 hover:bg-music/30 text-music p-4 h-20 flex items-center justify-center ${selectedInstrument === 'guitar' ? 'ring-2 ring-music' : ''}`}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 mr-2 text-2xl">🎸</span>
            Guitar
          </Button>
          <Button onClick={() => setSelectedInstrument('trumpet')} className={`bg-music/20 hover:bg-music/30 text-music p-4 h-20 flex items-center justify-center ${selectedInstrument === 'trumpet' ? 'ring-2 ring-music' : ''}`}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 mr-2 text-2xl">🎷</span>
            Trumpet
          </Button>
          <Button onClick={() => setSelectedInstrument('violin')} className={`bg-music/20 hover:bg-music/30 text-music p-4 h-20 flex items-center justify-center ${selectedInstrument === 'violin' ? 'ring-2 ring-music' : ''}`}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/80 mr-2 text-2xl">🎻</span>
            Violin
          </Button>
        </div>
        {/* Show keys and sample only if instrument is selected */}
        {selectedInstrument && (
          <>
            <div className="flex justify-center space-x-2 mb-8">
              {instrumentData[selectedInstrument].notes.map((note, index) => (
                <Button
                  key={note.key}
                  onClick={() => playNote(index)}
                  className={`w-16 h-32 ${note.color} text-white font-bold text-lg transform transition-all duration-150 ${currentNote === index ? 'scale-95 shadow-lg' : 'hover:scale-105'} border-2 border-white shadow-md`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">{note.key}</span>
                    <span className="text-xs">{note.sound}</span>
                  </div>
                </Button>
              ))}
            </div>
            <div className="text-center mb-6">
              <Button onClick={playSample} className="bg-music/40 hover:bg-music/60 text-music-foreground px-6 py-2 text-md">
                Play Sample: {instrumentData[selectedInstrument].sample.name} <br />
                <span className="text-xs">{instrumentData[selectedInstrument].sample.display}</span>
              </Button>
            </div>
          </>
        )}
        <div className="text-center">
          <Button onClick={endGame} className="bg-music hover:bg-music/90 text-music-foreground px-8 py-3 text-lg">
            <Music className="w-5 h-5 mr-2" />
            Finish Music Session
          </Button>
        </div>
        </Card>
      </div>
    </div>
  );
};