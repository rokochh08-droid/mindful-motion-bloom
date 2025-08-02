import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, MessageCircle } from "lucide-react";

interface MoodMatch {
  id: string;
  count: number;
  mood: string;
  energy: string;
  location: string;
  message: string;
  timeframe: string;
}

interface MoodBasedMatchingProps {
  matches: MoodMatch[];
  userMood?: string;
  userEnergy?: string;
  onConnect: (matchId: string) => void;
}

export function MoodBasedMatching({ matches, userMood, userEnergy, onConnect }: MoodBasedMatchingProps) {
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "struggling": return "bg-red-50 border-red-200 text-red-700";
      case "managing": return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "thriving": return "bg-green-50 border-green-200 text-green-700";
      default: return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-foreground">You're Not Alone</h3>
        <p className="text-sm text-muted-foreground">
          Others nearby are feeling similar today
        </p>
      </div>

      {matches.map((match) => (
        <Card key={match.id} className={`transition-colors ${getMoodColor(match.mood)} shadow-soft`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-current" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-white/50">
                    {match.count} others
                  </Badge>
                  <div className="flex items-center text-xs text-current">
                    <MapPin className="w-3 h-3 mr-1" />
                    {match.location}
                  </div>
                </div>
                <p className="text-sm text-current mb-2">
                  {match.message}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-70">{match.timeframe}</span>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => onConnect(match.id)}
                    className="h-7 text-xs bg-white/50 hover:bg-white/70 border-current/30"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Send support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}