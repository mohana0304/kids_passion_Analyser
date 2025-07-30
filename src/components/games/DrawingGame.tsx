import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Brush, Eraser, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrawingGameProps {
  onGameComplete: (score: number, timeSpent: number) => void;
}

export const DrawingGame = ({ onGameComplete }: DrawingGameProps) => {
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FF6B6B");
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#F8BBD9", "#FFB347", "#98D8C8", "#A8E6CF"
  ];

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    setScore(prev => prev + 1);
    draw(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    toast({
      title: "🎨 Canvas Cleared!",
      description: "Ready for your next masterpiece!",
      duration: 1000,
    });
  };

  const createMasterpiece = () => {
    setScore(prev => prev + 100);
    toast({
      title: "🎨 Masterpiece Created!",
      description: "Your artistic skills are amazing!",
      duration: 2000,
    });
  };

  const endGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    onGameComplete(score, timeSpent);
    
    toast({
      title: "🎨 Drawing Game Complete!",
      description: `You created beautiful art and scored ${score} points!`,
      duration: 3000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🎨</div>
        <h1 className="text-4xl font-bold text-art">Drawing & Painting</h1>
        <p className="text-lg text-muted-foreground">
          Create beautiful artwork with colors and brushes!
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-art/10 to-art/20">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-art">Score: {score}</div>
          <div className="text-lg text-art">
            Keep drawing to earn more points!
          </div>
        </div>

        {/* Color Palette */}
        <div className="flex justify-center space-x-2 mb-4">
          {colors.map((color) => (
            <Button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`
                w-10 h-10 rounded-full border-4 transition-all duration-200
                ${currentColor === color ? 'border-art scale-110' : 'border-white hover:scale-105'}
              `}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          <span className="text-art font-semibold">Brush Size:</span>
          {[2, 5, 10, 15].map((size) => (
            <Button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`
                w-12 h-12 rounded-full transition-all duration-200
                ${brushSize === size ? 'bg-art text-art-foreground' : 'bg-art/20 text-art hover:bg-art/30'}
              `}
            >
              {size}
            </Button>
          ))}
        </div>

        {/* Drawing Canvas */}
        <div className="bg-white rounded-lg p-4 mb-6 flex justify-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border-2 border-art/30 rounded-lg cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button
            onClick={clearCanvas}
            className="bg-art/20 hover:bg-art/30 text-art p-4 h-16"
          >
            <Eraser className="w-6 h-6 mr-2" />
            Clear Canvas
          </Button>
          <Button
            onClick={createMasterpiece}
            className="bg-art/20 hover:bg-art/30 text-art p-4 h-16"
          >
            <Palette className="w-6 h-6 mr-2" />
            Masterpiece
          </Button>
          <Button
            onClick={() => setScore(prev => prev + 25)}
            className="bg-art/20 hover:bg-art/30 text-art p-4 h-16"
          >
            <Brush className="w-6 h-6 mr-2" />
            Creative Mode
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={endGame}
            className="bg-art hover:bg-art/90 text-art-foreground px-8 py-3 text-lg"
          >
            <Palette className="w-5 h-5 mr-2" />
            Finish Artwork
          </Button>
        </div>
      </Card>
    </div>
  );
};