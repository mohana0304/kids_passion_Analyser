// // import { useState, useEffect } from "react";
// // import { Card } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Progress } from "@/components/ui/progress";
// // import { 
// //   BarChart3, 
// //   TrendingUp, 
// //   Clock, 
// //   Trophy, 
// //   Mail, 
// //   Download,
// //   ArrowLeft,
// //   Star
// // } from "lucide-react";
// // import { useGame } from "@/context/GameContext";
// // import { useToast } from "@/hooks/use-toast";
// // import { auth, db } from "@/lib/firebase";
// // import { collection, addDoc } from "firebase/firestore";

// // interface ParentDashboardProps {
// //   parentEmail: string;
// //   onBackToGames: () => void;
// // }

// // export const ParentDashboard = ({ parentEmail, onBackToGames }: ParentDashboardProps) => {
// //   const { gameHistory, getGameStats, recordGameSession } = useGame();
// //   const { toast } = useToast();
// //   const [parentUid, setParentUid] = useState<string | null>(null);

// //   // Monitor authentication state to get parent's UID
// //   useEffect(() => {
// //     const unsubscribe = auth.onAuthStateChanged((user) => {
// //       if (user) {
// //         setParentUid(user.uid);
// //       } else {
// //         setParentUid(null);
// //       }
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   // Store game sessions in Firestore
// //   useEffect(() => {
// //     if (parentUid && gameHistory.length > 0) {
// //       gameHistory.forEach((session) => {
// //         // Check if session is already stored (simplified without firestoreId)
// //         addDoc(collection(db, "parents", parentUid, "gameSessions"), {
// //           gameType: session.gameType,
// //           minutesPlayed: Math.round(session.timeSpent / 60),
// //           score: session.score,
// //           timestamp: session.timestamp,
// //           createdAt: new Date().toISOString(),
// //         }).then((docRef) => {
// //           console.log("Session stored with ID:", docRef.id);
// //         }).catch((error) => {
// //           console.error("Error storing session:", error);
// //           toast({
// //             title: "Storage Error",
// //             description: "Failed to save game session: " + error.message,
// //             variant: "destructive",
// //           });
// //         });
// //       });
// //     }
// //   }, [parentUid, gameHistory, toast]);

// //   const stats = getGameStats();

// //   const generateReport = () => {
// //     if (gameHistory.length === 0) {
// //       toast({
// //         title: "No data available",
// //         description: "Your child needs to play some games first!",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     const report = {
// //       parentEmail,
// //       generatedAt: new Date().toISOString(),
// //       totalSessions: stats.totalSessions,
// //       totalTimeSpent: Math.round(stats.totalTimeSpent / 60),
// //       averageScore: Math.round(stats.averageScore),
// //       topInterests: stats.topGames.slice(0, 3),
// //       recommendation: generateRecommendation()
// //     };

// //     // In a real app, this would send an email
// //     toast({
// //       title: "📧 Report Generated!",
// //       description: "Weekly report has been sent to your email",
// //     });

// //     console.log("Generated Report:", report);
// //   };

// //   const generateRecommendation = () => {
// //     const topGame = stats.topGames[0];
// //     if (!topGame) return "Encourage your child to explore different games!";

// //     const recommendations = {
// //       "Music Game": "🎵 Consider music lessons or instruments for your child!",
// //       "Forest Adventure": "🌳 Your child loves nature! Try outdoor activities and nature camps.",
// //       "Building Blocks": "🏗️ Engineering potential! Try robotics or construction toys.",
// //       "Drawing & Painting": "🎨 Artistic talent! Consider art classes or creative workshops.",
// //       "Learning Games": "📚 Academic excellence! Encourage reading and educational activities.",
// //       "Cooking Game": "🍳 Culinary interest! Try cooking together at home.",
// //       "Fashion Design": "👗 Creative design skills! Explore fashion or design activities.",
// //       "Sports Game": "⚽ Physical activity lover! Consider sports teams or activities."
// //     };

// //     return recommendations[topGame.gameType] || "Keep exploring different interests!";
// //   };

// //   const gameTypeColors = {
// //     "Music Game": "bg-music",
// //     "Forest Adventure": "bg-nature",
// //     "Building Blocks": "bg-engineering",
// //     "Drawing & Painting": "bg-art",
// //     "Learning Games": "bg-learning",
// //     "Cooking Game": "bg-cooking",
// //     "Fashion Design": "bg-fashion",
// //     "Sports Game": "bg-sports"
// //   };

// //   const maxSessions = Math.max(...stats.topGames.map(g => g.sessions), 1);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
// //       <div className="max-w-6xl mx-auto space-y-6">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h1 className="text-3xl font-bold text-primary mb-2">
// //               Parent Dashboard
// //             </h1>
// //             <p className="text-muted-foreground">
// //               Welcome back, {parentEmail}
// //             </p>
// //           </div>
// //           <div className="flex gap-2">
// //             <Button onClick={onBackToGames} variant="outline">
// //               <ArrowLeft className="w-4 h-4 mr-2" />
// //               Back to Games
// //             </Button>
// //             <Button onClick={generateReport} className="bg-primary hover:bg-primary/90">
// //               <Mail className="w-4 h-4 mr-2" />
// //               Generate Report
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Stats Overview */}
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <Card className="p-6">
// //             <div className="flex items-center space-x-2">
// //               <Trophy className="w-8 h-8 text-primary" />
// //               <div>
// //                 <p className="text-sm text-muted-foreground">Total Sessions</p>
// //                 <p className="text-2xl font-bold">{stats.totalSessions}</p>
// //               </div>
// //             </div>
// //           </Card>

// //           <Card className="p-6">
// //             <div className="flex items-center space-x-2">
// //               <Clock className="w-8 h-8 text-accent" />
// //               <div>
// //                 <p className="text-sm text-muted-foreground">Time Played</p>
// //                 <p className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}m</p>
// //               </div>
// //             </div>
// //           </Card>

// //           <Card className="p-6">
// //             <div className="flex items-center space-x-2">
// //               <Star className="w-8 h-8 text-secondary" />
// //               <div>
// //                 <p className="text-sm text-muted-foreground">Avg Score</p>
// //                 <p className="text-2xl font-bold">{Math.round(stats.averageScore)}</p>
// //               </div>
// //             </div>
// //           </Card>

// //           <Card className="p-6">
// //             <div className="flex items-center space-x-2">
// //               <TrendingUp className="w-8 h-8 text-nature" />
// //               <div>
// //                 <p className="text-sm text-muted-foreground">Top Interest</p>
// //                 <p className="text-sm font-bold">
// //                   {stats.topGames[0]?.gameType.replace(" Game", "") || "None"}
// //                 </p>
// //               </div>
// //             </div>
// //           </Card>
// //         </div>

// //         {/* Simple Bar Chart */}
// //         <Card className="p-6">
// //           <h3 className="text-xl font-bold mb-4">Game Sessions</h3>
// //           <div className="space-y-4">
// //             {stats.topGames.map((game, index) => (
// //               <div key={game.gameType} className="flex items-center space-x-4">
// //                 <div className="w-24 text-sm font-medium text-right">
// //                   {game.gameType.replace(" Game", "")}
// //                 </div>
// //                 <div className="flex-1 relative">
// //                   <div className="h-8 bg-muted rounded-full overflow-hidden">
// //                     <div 
// //                       className={`h-full ${gameTypeColors[game.gameType] || "bg-primary"} transition-all duration-500`}
// //                       style={{ width: `${(game.sessions / maxSessions) * 100}%` }}
// //                     />
// //                   </div>
// //                   <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
// //                     {game.sessions} sessions
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </Card>

// //         {/* Interest Distribution */}
// //         <Card className="p-6">
// //           <h3 className="text-xl font-bold mb-4">Interest Distribution</h3>
// //           <div className="grid grid-cols-2 gap-4">
// //             {stats.topGames.slice(0, 4).map((game, index) => (
// //               <div key={game.gameType} className="flex items-center space-x-3">
// //                 <div 
// //                   className={`w-4 h-4 rounded-full ${gameTypeColors[game.gameType] || "bg-primary"}`}
// //                 />
// //                 <div className="flex-1">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-sm font-medium">
// //                       {game.gameType.replace(" Game", "")}
// //                     </span>
// //                     <span className="text-sm text-muted-foreground">
// //                       {game.percentage.toFixed(1)}%
// //                     </span>
// //                   </div>
// //                   <Progress value={game.percentage} className="mt-1" />
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </Card>

// //         {/* Top Interests */}
// //         <Card className="p-6">
// //           <h3 className="text-xl font-bold mb-4">Your Child's Top Interests</h3>
// //           <div className="space-y-4">
// //             {stats.topGames.slice(0, 5).map((game, index) => (
// //               <div key={game.gameType} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
// //                 <div className="flex items-center space-x-3">
// //                   <Badge variant="secondary">#{index + 1}</Badge>
// //                   <div>
// //                     <p className="font-semibold">{game.gameType}</p>
// //                     <p className="text-sm text-muted-foreground">
// //                       {game.sessions} sessions • Avg score: {Math.round(game.averageScore)}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-2xl font-bold text-primary">{game.percentage.toFixed(1)}%</p>
// //                   <Progress value={game.percentage} className="w-20" />
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </Card>

// //         {/* AI Recommendations */}
// //         <Card className="p-6">
// //           <h3 className="text-xl font-bold mb-4">🤖 AI Recommendation</h3>
// //           <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
// //             <p className="text-lg">{generateRecommendation()}</p>
// //           </div>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };


// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { 
//   BarChart3, 
//   TrendingUp, 
//   Clock, 
//   Trophy, 
//   Mail, 
//   Download,
//   ArrowLeft,
//   Star
// } from "lucide-react";
// import { useGame } from "@/context/GameContext";
// import { useToast } from "@/hooks/use-toast";

// interface ParentDashboardProps {
//   parentEmail: string;
//   onBackToGames: () => void;
// }

// export const ParentDashboard = ({ parentEmail, onBackToGames }: ParentDashboardProps) => {
//   const { gameHistory, getGameStats } = useGame();
//   const { toast } = useToast();
//   const [stats, setStats] = useState(getGameStats());

//   // Update stats when gameHistory changes and log for debugging
//   useEffect(() => {
//     console.log("Game History:", gameHistory);
//     setStats(getGameStats());
//   }, [gameHistory, getGameStats]);

//   const generateReport = () => {
//     if (gameHistory.length === 0) {
//       toast({
//         title: "No data available",
//         description: "Your child needs to play some games first!",
//         variant: "destructive",
//       });
//       return;
//     }

//     const report = {
//       parentEmail,
//       generatedAt: new Date().toISOString(),
//       totalSessions: stats.totalSessions,
//       totalTimeSpent: Math.round(stats.totalTimeSpent / 60),
//       averageScore: Math.round(stats.averageScore),
//       topInterests: stats.topGames.slice(0, 3),
//       recommendation: generateRecommendation()
//     };

//     toast({
//       title: "📧 Report Generated!",
//       description: "Weekly report has been sent to your email",
//     });

//     console.log("Generated Report:", report);
//   };

//   const generateRecommendation = () => {
//     const topGame = stats.topGames[0];
//     if (!topGame) return "Encourage your child to explore different games!";

//     const recommendations = {
//       "Music Game": "🎵 Consider music lessons or instruments for your child!",
//       "Forest Adventure": "🌳 Your child loves nature! Try outdoor activities and nature camps.",
//       "Building Blocks": "🏗️ Engineering potential! Try robotics or construction toys.",
//       "Drawing & Painting": "🎨 Artistic talent! Consider art classes or creative workshops.",
//       "Learning Games": "📚 Academic excellence! Encourage reading and educational activities.",
//       "Cooking Game": "🍳 Culinary interest! Try cooking together at home.",
//       "Fashion Design": "👗 Creative design skills! Explore fashion or design activities.",
//       "Sports Game": "⚽ Physical activity lover! Consider sports teams or activities."
//     };

//     return recommendations[topGame.gameType] || "Keep exploring different interests!";
//   };

//   const gameTypeColors = {
//     "Music Game": "bg-music",
//     "Forest Adventure": "bg-nature",
//     "Building Blocks": "bg-engineering",
//     "Drawing & Painting": "bg-art",
//     "Learning Games": "bg-learning",
//     "Cooking Game": "bg-cooking",
//     "Fashion Design": "bg-fashion",
//     "Sports Game": "bg-sports"
//   };

//   const maxSessions = Math.max(...stats.topGames.map(g => g.sessions), 1);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-primary mb-2">
//               Parent Dashboard
//             </h1>
//             <p className="text-muted-foreground">
//               Welcome back, {parentEmail}
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <Button onClick={onBackToGames} variant="outline">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Games
//             </Button>
//             <Button onClick={generateReport} className="bg-primary hover:bg-primary/90">
//               <Mail className="w-4 h-4 mr-2" />
//               Generate Report
//             </Button>
//           </div>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="p-6">
//             <div className="flex items-center space-x-2">
//               <Trophy className="w-8 h-8 text-primary" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Sessions</p>
//                 <p className="text-2xl font-bold">{stats.totalSessions}</p>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center space-x-2">
//               <Clock className="w-8 h-8 text-accent" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Time Played</p>
//                 <p className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}m</p>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center space-x-2">
//               <Star className="w-8 h-8 text-secondary" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Avg Score</p>
//                 <p className="text-2xl font-bold">{Math.round(stats.averageScore)}</p>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center space-x-2">
//               <TrendingUp className="w-8 h-8 text-nature" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Top Interest</p>
//                 <p className="text-sm font-bold">
//                   {stats.topGames[0]?.gameType.replace(" Game", "") || "None"}
//                 </p>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Simple Bar Chart */}
//         <Card className="p-6">
//           <h3 className="text-xl font-bold mb-4">Game Sessions</h3>
//           <div className="space-y-4">
//             {stats.topGames.map((game, index) => (
//               <div key={game.gameType} className="flex items-center space-x-4">
//                 <div className="w-24 text-sm font-medium text-right">
//                   {game.gameType.replace(" Game", "")}
//                 </div>
//                 <div className="flex-1 relative">
//                   <div className="h-8 bg-muted rounded-full overflow-hidden">
//                     <div 
//                       className={`h-full ${gameTypeColors[game.gameType] || "bg-primary"} transition-all duration-500`}
//                       style={{ width: `${(game.sessions / maxSessions) * 100}%` }}
//                     />
//                   </div>
//                   <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
//                     {game.sessions} sessions
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Interest Distribution */}
//         <Card className="p-6">
//           <h3 className="text-xl font-bold mb-4">Interest Distribution</h3>
//           <div className="grid grid-cols-2 gap-4">
//             {stats.topGames.slice(0, 4).map((game, index) => (
//               <div key={game.gameType} className="flex items-center space-x-3">
//                 <div 
//                   className={`w-4 h-4 rounded-full ${gameTypeColors[game.gameType] || "bg-primary"}`}
//                 />
//                 <div className="flex-1">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm font-medium">
//                       {game.gameType.replace(" Game", "")}
//                     </span>
//                     <span className="text-sm text-muted-foreground">
//                       {game.percentage.toFixed(1)}%
//                     </span>
//                   </div>
//                   <Progress value={game.percentage} className="mt-1" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Top Interests */}
//         <Card className="p-6">
//           <h3 className="text-xl font-bold mb-4">Your Child's Top Interests</h3>
//           <div className="space-y-4">
//             {stats.topGames.slice(0, 5).map((game, index) => (
//               <div key={game.gameType} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <Badge variant="secondary">#{index + 1}</Badge>
//                   <div>
//                     <p className="font-semibold">{game.gameType}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {game.sessions} sessions • Avg score: {Math.round(game.averageScore)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-2xl font-bold text-primary">{game.percentage.toFixed(1)}%</p>
//                   <Progress value={game.percentage} className="w-20" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* AI Recommendations */}
//         <Card className="p-6">
//           <h3 className="text-xl font-bold mb-4">🤖 AI Recommendation</h3>
//           <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
//             <p className="text-lg">{generateRecommendation()}</p>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Trophy, 
  Mail, 
  Download,
  ArrowLeft,
  Star
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useToast } from "@/hooks/use-toast";

interface ParentDashboardProps {
  parentEmail: string;
  onBackToGames: () => void;
}

export const ParentDashboard = ({ parentEmail, onBackToGames }: ParentDashboardProps) => {
  const { gameHistory, getGameStats, loading } = useGame();
  const { toast } = useToast();
  const [stats, setStats] = useState(getGameStats());

  useEffect(() => {
    console.log("Game History:", gameHistory);
    setStats(getGameStats());
  }, [gameHistory, getGameStats]);

  const generateReport = () => {
    if (gameHistory.length === 0) {
      toast({
        title: "No data available",
        description: "Your child needs to play some games first!",
        variant: "destructive",
      });
      return;
    }

    const report = {
      parentEmail,
      generatedAt: new Date().toISOString(),
      totalSessions: stats.totalSessions,
      totalTimeSpent: Math.round(stats.totalTimeSpent / 60),
      averageScore: Math.round(stats.averageScore),
      topInterests: stats.topGames.slice(0, 3),
      recommendation: generateRecommendation()
    };

    toast({
      title: "📧 Report Generated!",
      description: "Weekly report has been sent to your email",
    });

    console.log("Generated Report:", report);
  };

  const generateRecommendation = () => {
    const topGame = stats.topGames[0];
    if (!topGame) return "Encourage your child to explore different games!";

    const recommendations = {
      "Music Game": "🎵 Consider music lessons or instruments for your child!",
      "Forest Adventure": "🌳 Your child loves nature! Try outdoor activities and nature camps.",
      "Building Blocks": "🏗️ Engineering potential! Try robotics or construction toys.",
      "Drawing & Painting": "🎨 Artistic talent! Consider art classes or creative workshops.",
      "Learning Games": "📚 Academic excellence! Encourage reading and educational activities.",
      "Cooking Game": "🍳 Culinary interest! Try cooking together at home.",
      "Fashion Design": "👗 Creative design skills! Explore fashion or design activities.",
      "Sports Game": "⚽ Physical activity lover! Consider sports teams or activities."
    };

    return recommendations[topGame.gameType] || "Keep exploring different interests!";
  };

  const gameTypeColors = {
    "Music Game": "bg-music",
    "Forest Adventure": "bg-nature",
    "Building Blocks": "bg-engineering",
    "Drawing & Painting": "bg-art",
    "Learning Games": "bg-learning",
    "Cooking Game": "bg-cooking",
    "Fashion Design": "bg-fashion",
    "Sports Game": "bg-sports"
  };

  const maxSessions = Math.max(...stats.topGames.map(g => g.sessions), 1);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Parent Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {parentEmail}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onBackToGames} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
            <Button onClick={generateReport} className="bg-primary hover:bg-primary/90">
              <Mail className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Time Played</p>
                <p className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}m</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageScore)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-nature" />
              <div>
                <p className="text-sm text-muted-foreground">Top Interest</p>
                <p className="text-sm font-bold">
                  {stats.topGames[0]?.gameType.replace(" Game", "") || "None"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Simple Bar Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Game Sessions</h3>
          <div className="space-y-4">
            {stats.topGames.map((game, index) => (
              <div key={game.gameType} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-right">
                  {game.gameType.replace(" Game", "")}
                </div>
                <div className="flex-1 relative">
                  <div className="h-8 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${gameTypeColors[game.gameType] || "bg-primary"} transition-all duration-500`}
                      style={{ width: `${(game.sessions / maxSessions) * 100}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                    {game.sessions} sessions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Interest Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Interest Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.topGames.slice(0, 4).map((game, index) => (
              <div key={game.gameType} className="flex items-center space-x-3">
                <div 
                  className={`w-4 h-4 rounded-full ${gameTypeColors[game.gameType] || "bg-primary"}`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {game.gameType.replace(" Game", "")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {game.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={game.percentage} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Interests */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Your Child's Top Interests</h3>
          <div className="space-y-4">
            {stats.topGames.slice(0, 5).map((game, index) => (
              <div key={game.gameType} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <div>
                    <p className="font-semibold">{game.gameType}</p>
                    <p className="text-sm text-muted-foreground">
                      {game.sessions} sessions • Avg score: {Math.round(game.averageScore)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{game.percentage.toFixed(1)}%</p>
                  <Progress value={game.percentage} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">🤖 AI Recommendation</h3>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
            <p className="text-lg">{generateRecommendation()}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};