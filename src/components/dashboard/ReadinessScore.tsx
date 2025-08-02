import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface ReadinessScoreProps {
  score: number; // 1-10
  moodAverage: number;
  energyLevel: number;
}

export function ReadinessScore({ score, moodAverage, energyLevel }: ReadinessScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-emerald-400 to-green-500";
    if (score >= 6) return "from-yellow-400 to-orange-400";
    if (score >= 4) return "from-orange-400 to-red-400";
    return "from-red-400 to-red-500";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 8) return "You're feeling great today! 🌟";
    if (score >= 6) return "Good energy for today 💫";
    if (score >= 4) return "Taking it steady today 🌙";
    return "Rest and gentle care today 🤗";
  };

  // Calculate readiness score based on mood and energy
  const readinessScore = Math.round((moodAverage + energyLevel) / 2);

  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Your Readiness</h3>
          <Heart className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <div 
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${getScoreColor(readinessScore)} flex items-center justify-center shadow-soft`}
              >
                <span className="text-white font-bold text-xl">
                  {readinessScore}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">
              {getScoreMessage(readinessScore)}
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Mood: {moodAverage}/10</div>
              <div>Energy: {energyLevel}/10</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}