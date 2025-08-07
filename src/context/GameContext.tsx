// import { createContext, useContext, useState, useEffect } from "react";

// export interface GameSession {
//   gameType: string;
//   score: number;
//   timeSpent: number;
//   timestamp: number;
// }

// export interface GameStats {
//   totalSessions: number;
//   averageScore: number;
//   totalTimeSpent: number;
//   topGames: Array<{
//     gameType: string;
//     sessions: number;
//     percentage: number;
//     averageScore: number;
//   }>;
// }

// interface GameContextType {
//   gameHistory: GameSession[];
//   recordGameSession: (session: GameSession) => void;
//   getGameStats: () => GameStats;
//   clearHistory: () => void;
//   currentChild: string;
//   setCurrentChild: (name: string) => void;
// }

// const GameContext = createContext<GameContextType | undefined>(undefined);

// export const useGame = () => {
//   const context = useContext(GameContext);
//   if (!context) {
//     throw new Error("useGame must be used within a GameProvider");
//   }
//   return context;
// };

// export const GameProvider = ({ children }: { children: React.ReactNode }) => {
//   const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
//   const [currentChild, setCurrentChild] = useState("Anonymous");

//   // Load game history from localStorage on mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem("kidsInterestIndicator_gameHistory");
//     if (savedHistory) {
//       setGameHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Save game history to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("kidsInterestIndicator_gameHistory", JSON.stringify(gameHistory));
//   }, [gameHistory]);

//   const recordGameSession = (session: GameSession) => {
//     setGameHistory(prev => [...prev, session]);
//   };

//   const getGameStats = (): GameStats => {
//     const totalSessions = gameHistory.length;
//     const averageScore = gameHistory.reduce((sum, session) => sum + session.score, 0) / totalSessions || 0;
//     const totalTimeSpent = gameHistory.reduce((sum, session) => sum + session.timeSpent, 0);

//     // Calculate game type statistics
//     const gameTypeStats = gameHistory.reduce((acc, session) => {
//       if (!acc[session.gameType]) {
//         acc[session.gameType] = { sessions: 0, totalScore: 0 };
//       }
//       acc[session.gameType].sessions++;
//       acc[session.gameType].totalScore += session.score;
//       return acc;
//     }, {} as Record<string, { sessions: number; totalScore: number }>);

//     const topGames = Object.entries(gameTypeStats)
//       .map(([gameType, stats]) => ({
//         gameType,
//         sessions: stats.sessions,
//         percentage: (stats.sessions / totalSessions) * 100,
//         averageScore: stats.totalScore / stats.sessions
//       }))
//       .sort((a, b) => b.percentage - a.percentage);

//     return {
//       totalSessions,
//       averageScore,
//       totalTimeSpent,
//       topGames
//     };
//   };

//   const clearHistory = () => {
//     setGameHistory([]);
//     localStorage.removeItem("kidsInterestIndicator_gameHistory");
//   };

//   return (
//     <GameContext.Provider
//       value={{
//         gameHistory,
//         recordGameSession,
//         getGameStats,
//         clearHistory,
//         currentChild,
//         setCurrentChild
//       }}
//     >
//       {children}
//     </GameContext.Provider>
//   );
// };

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

export interface GameSession {
  gameType: string;
  score: number;
  timeSpent: number; // In seconds
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

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [currentChild, setCurrentChild] = useState("Anonymous");

  // Sync game history with Firestore
  useEffect(() => {
    if (auth.currentUser?.uid) {
      const q = query(collection(db, "parents", auth.currentUser.uid, "gameSessions"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessions: GameSession[] = snapshot.docs.map(doc => ({
          gameType: doc.data().gameType,
          score: doc.data().score,
          timeSpent: doc.data().minutesPlayed * 60, // Convert minutes back to seconds
          timestamp: doc.data().timestamp,
        }));
        setGameHistory(sessions);
      }, (error) => {
        console.error("Error syncing game sessions:", error);
      });
      return () => unsubscribe();
    }
  }, []);

  const recordGameSession = (session: GameSession) => {
    if (auth.currentUser?.uid) {
      addDoc(collection(db, "parents", auth.currentUser.uid, "gameSessions"), {
        gameType: session.gameType,
        minutesPlayed: Math.round(session.timeSpent / 60), // Convert seconds to minutes
        score: session.score,
        timestamp: session.timestamp,
        createdAt: new Date().toISOString(),
      }).then(() => {
        // Session is added to Firestore; onSnapshot will update gameHistory
        console.log("Session recorded successfully");
      }).catch((error) => {
        console.error("Error recording session:", error);
      });
    }
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
    if (auth.currentUser?.uid) {
      // Optionally delete all documents in gameSessions collection
      // Note: This requires a batched delete or security rules to allow it
      setGameHistory([]);
      console.log("Game history cleared locally; Firestore deletion not implemented");
    }
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