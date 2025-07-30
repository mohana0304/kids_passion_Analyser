import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export const GameCard = ({ title, description, icon, color, onClick }: GameCardProps) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      music: {
        bg: "bg-music",
        hover: "hover:bg-music/90",
        text: "text-music-foreground",
        gradient: "from-music to-music/80"
      },
      nature: {
        bg: "bg-nature",
        hover: "hover:bg-nature/90", 
        text: "text-nature-foreground",
        gradient: "from-nature to-nature/80"
      },
      engineering: {
        bg: "bg-engineering",
        hover: "hover:bg-engineering/90",
        text: "text-engineering-foreground", 
        gradient: "from-engineering to-engineering/80"
      },
      art: {
        bg: "bg-art",
        hover: "hover:bg-art/90",
        text: "text-art-foreground",
        gradient: "from-art to-art/80"
      },
      learning: {
        bg: "bg-learning",
        hover: "hover:bg-learning/90",
        text: "text-learning-foreground",
        gradient: "from-learning to-learning/80"
      },
      cooking: {
        bg: "bg-cooking",
        hover: "hover:bg-cooking/90",
        text: "text-cooking-foreground",
        gradient: "from-cooking to-cooking/80"
      },
      fashion: {
        bg: "bg-fashion",
        hover: "hover:bg-fashion/90",
        text: "text-fashion-foreground",
        gradient: "from-fashion to-fashion/80"
      },
      sports: {
        bg: "bg-sports",
        hover: "hover:bg-sports/90",
        text: "text-sports-foreground",
        gradient: "from-sports to-sports/80"
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.music;
  };

  const colors = getColorClasses(color);

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer animate-bounce-in">
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10`} />
      <div className="relative p-6 flex flex-col items-center text-center space-y-4">
        <div className="text-6xl animate-float">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button 
          onClick={onClick}
          className={`${colors.bg} ${colors.hover} ${colors.text} animate-wiggle hover:animate-pop`}
        >
          <Play className="w-4 h-4 mr-2" />
          Play Game
        </Button>
      </div>
    </Card>
  );
};