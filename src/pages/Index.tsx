import { useState } from "react";
import { ParentAuth } from "@/components/ParentAuth";
import { GameSelector } from "@/components/GameSelector";
import { ParentDashboard } from "@/components/ParentDashboard";

const Index = () => {
  const [parentEmail, setParentEmail] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleAuthSuccess = (email: string) => {
    setParentEmail(email);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  const handleBackToGames = () => {
    setShowDashboard(false);
  };

  if (!parentEmail) {
    return <ParentAuth onAuthSuccess={handleAuthSuccess} />;
  }

  if (showDashboard) {
    return (
      <ParentDashboard 
        parentEmail={parentEmail} 
        onBackToGames={handleBackToGames}
      />
    );
  }

  return (
    <GameSelector onShowDashboard={handleShowDashboard} />
  );
};

export default Index;
