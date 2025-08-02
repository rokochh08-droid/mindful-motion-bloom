import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Coffee, Sun } from "lucide-react";

interface CelebrationPrompt {
  id: string;
  name: string;
  achievement: string;
  needsEncouragement: boolean;
  timeframe: string;
  suggestedMessage: string;
}

interface GentleCelebrationProps {
  prompts: CelebrationPrompt[];
  onSendEncouragement: (promptId: string, message?: string) => void;
}

export function GentleCelebration({ prompts, onSendEncouragement }: GentleCelebrationProps) {
  const getIcon = (achievement: string) => {
    if (achievement.includes("workout")) return Coffee;
    if (achievement.includes("goal")) return Sparkles;
    if (achievement.includes("mood")) return Sun;
    return Heart;
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-foreground">Gentle Celebrations</h3>
        <p className="text-sm text-muted-foreground">
          Small wins deserve recognition
        </p>
      </div>

      {prompts.map((prompt) => {
        const Icon = getIcon(prompt.achievement);
        
        return (
          <Card key={prompt.id} className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-2">
                    <span className="font-medium">{prompt.name}</span> {prompt.achievement}
                  </p>
                  {prompt.needsEncouragement && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {prompt.name} could use some gentle encouragement today
                    </p>
                  )}
                  <div className="bg-white/50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Suggested message:</p>
                    <p className="text-sm text-foreground italic">
                      "{prompt.suggestedMessage}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{prompt.timeframe}</span>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onSendEncouragement(prompt.id)}
                        className="h-7 text-xs"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Send warmth
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => onSendEncouragement(prompt.id, prompt.suggestedMessage)}
                        className="h-7 text-xs bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                      >
                        Use suggestion
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}