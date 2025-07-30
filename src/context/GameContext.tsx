import { createContext, useContext, useState, useEffect } from "react";

export interface GameSession {
  gameType: string;
  score: number;
  timeSpent: number;
  timestamp: number;
}

export interface GameStats {
  totalSessions: number;
  averageScore: number;
  totalTimeSpent: number;
  topGames: Array<{
    gameType: string;
    sessions: number;
    percentage: number;
    averageScore: number;
  }>;
}

interface GameContextType {
  gameHistory: GameSession[];
  recordGameSession: (session: GameSession) => void;
  getGameStats: () => GameStats;
  clearHistory: () => void;
  currentChild: string;
  setCurrentChild: (name: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [currentChild, setCurrentChild] = useState("Anonymous");

  // Load game history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("kidsInterestIndicator_gameHistory");
    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save game history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("kidsInterestIndicator_gameHistory", JSON.stringify(gameHistory));
  }, [gameHistory]);

  const recordGameSession = (session: GameSession) => {
    setGameHistory(prev => [...prev, session]);
  };

  const getGameStats = (): GameStats => {
    const totalSessions = gameHistory.length;
    const averageScore = gameHistory.reduce((sum, session) => sum + session.score, 0) / totalSessions || 0;
    const totalTimeSpent = gameHistory.reduce((sum, session) => sum + session.timeSpent, 0);

    // Calculate game type statistics
    const gameTypeStats = gameHistory.reduce((acc, session) => {
      if (!acc[session.gameType]) {
        acc[session.gameType] = { sessions: 0, totalScore: 0 };
      }
      acc[session.gameType].sessions++;
      acc[session.gameType].totalScore += session.score;
      return acc;
    }, {} as Record<string, { sessions: number; totalScore: number }>);

    const topGames = Object.entries(gameTypeStats)
      .map(([gameType, stats]) => ({
        gameType,
        sessions: stats.sessions,
        percentage: (stats.sessions / totalSessions) * 100,
        averageScore: stats.totalScore / stats.sessions
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalSessions,
      averageScore,
      totalTimeSpent,
      topGames
    };
  };

  const clearHistory = () => {
    setGameHistory([]);
    localStorage.removeItem("kidsInterestIndicator_gameHistory");
  };

  return (
    <GameContext.Provider
      value={{
        gameHistory,
        recordGameSession,
        getGameStats,
        clearHistory,
        currentChild,
        setCurrentChild
      }}
    >
      {children}
    </GameContext.Provider>
  );
};