import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust path

interface MultiGameProps {
  onBack: () => void;
  onComplete?: (win: boolean, score: number) => void;
  childId?: string;
  parentUid: string; // ✅ added parent UID
}

const MultiGame: React.FC<MultiGameProps> = ({ onBack, onComplete, childId, parentUid }) => {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [currentChild, setCurrentChild] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch child name from Firestore
  useEffect(() => {
    const fetchChildName = async () => {
      if (!childId) {
        setCurrentChild(null);
        return;
      }

      try {
        const childDocRef = doc(db, "children", childId);
        const childDoc = await getDoc(childDocRef);
        if (childDoc.exists()) {
          const data = childDoc.data();
          setCurrentChild(data.name || "Human");
        } else {
          setCurrentChild("Human");
          toast({
            title: "Error",
            description: "Child profile not found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching child name:", error);
        setCurrentChild("Human");
        toast({
          title: "Error",
          description: "Failed to fetch child name.",
          variant: "destructive",
        });
      }
    };

    fetchChildName();
  }, [childId, toast]);

  // Handle AI move after player's move
  useEffect(() => {
    if (chess.turn() === "b" && !chess.isGameOver()) {
      const moves = chess.moves();
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        setTimeout(() => {
          chess.move(randomMove);
          setFen(chess.fen());
          checkGameOver();
        }, 500);
      }
    }
  }, [fen, chess]);

  // Save session in Firestore
  const saveSession = async (result: string, win: boolean, score: number) => {
    try {
      const sessionId = crypto.randomUUID(); // ✅ unique ID
      const sessionRef = doc(db, "parents", parentUid, "sessions", sessionId);

      await setDoc(sessionRef, {
        fen,
        result,
        win,
        score,
        childName: currentChild || "Human",
        timestamp: new Date(),
      });

      console.log("Session saved:", sessionId);
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        title: "Error",
        description: "Failed to save game session.",
        variant: "destructive",
      });
    }
  };

  // Check if game is over and trigger onComplete
  const checkGameOver = () => {
    if (chess.isGameOver()) {
      let message = "";
      let win = false;
      let score = 0;
      let result = "";

      if (chess.isCheckmate()) {
        win = chess.turn() === "b";
        result = win ? "win" : "lose";
        message = win ? "Checkmate! You win!" : "Checkmate! AI wins!";
        score = win ? 100 : 0;
      } else if (chess.isDraw()) {
        result = "draw";
        message = "Game is a draw!";
        score = 50;
      } else if (chess.isStalemate()) {
        result = "stalemate";
        message = "Stalemate!";
        score = 50;
      } else if (chess.isThreefoldRepetition()) {
        result = "threefold";
        message = "Draw by threefold repetition!";
        score = 50;
      } else if (chess.isInsufficientMaterial()) {
        result = "insufficient";
        message = "Draw by insufficient material!";
        score = 50;
      }

      toast({
        title: "Game Over",
        description: message,
        variant: win ? "default" : "destructive",
      });

      // ✅ Save game session under parent
      saveSession(result, win, score);

      onComplete?.(win, score);
    }
  };

  // Handle player's move
  const handleMove = ({ sourceSquare, targetSquare, promotion = "q" }: { sourceSquare: string; targetSquare: string; promotion?: string }) => {
    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion,
      });

      if (move) {
        setFen(chess.fen());
        checkGameOver();
      } else {
        toast({
          title: "Invalid Move",
          description: "Please try a legal chess move.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid Move",
        description: "Please try a legal chess move.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-8 flex flex-col items-center">
      <Button onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2" /> Back to Home
      </Button>
      <h2 className="text-2xl font-bold mb-4">Computer Vs {currentChild || "Human"}</h2>
      <Chessboard
        width={600}
        position={fen}
        onDrop={handleMove}
        orientation="white"
      />
    </Card>
  );
};

export default MultiGame;
