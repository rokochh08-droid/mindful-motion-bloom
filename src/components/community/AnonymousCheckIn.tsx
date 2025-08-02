import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown, Coffee, Moon, Zap } from "lucide-react";

const moodOptions = [
  { icon: Frown, label: "Struggling", value: "struggling", color: "bg-red-100 text-red-700" },
  { icon: Meh, label: "Managing", value: "managing", color: "bg-yellow-100 text-yellow-700" },
  { icon: Smile, label: "Thriving", value: "thriving", color: "bg-green-100 text-green-700" },
];

const energyOptions = [
  { icon: Moon, label: "Low energy", value: "low", color: "bg-blue-100 text-blue-700" },
  { icon: Coffee, label: "Steady", value: "steady", color: "bg-orange-100 text-orange-700" },
  { icon: Zap, label: "High energy", value: "high", color: "bg-purple-100 text-purple-700" },
];

interface AnonymousCheckInProps {
  onCheckIn: (mood: string, energy: string) => void;
}

export function AnonymousCheckIn({ onCheckIn }: AnonymousCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedEnergy, setSelectedEnergy] = useState<string>("");
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const handleSubmit = () => {
    if (selectedMood && selectedEnergy) {
      onCheckIn(selectedMood, selectedEnergy);
      setHasCheckedIn(true);
    }
  };

  if (hasCheckedIn) {
    return (
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-foreground mb-2">Thanks for checking in! 💙</p>
          <p className="text-xs text-muted-foreground">
            Your anonymous check-in helps others feel less alone
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-3 text-center">
          How's everyone feeling today?
        </h3>
        <p className="text-xs text-muted-foreground mb-4 text-center">
          Anonymous check-in • Helps others feel connected
        </p>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">How are you feeling overall?</p>
            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map(({ icon: Icon, label, value, color }) => (
                <Button
                  key={value}
                  variant={selectedMood === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(value)}
                  className={`h-12 flex-col space-y-1 ${
                    selectedMood === value ? "bg-primary/10 border-primary/30" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">What's your energy like?</p>
            <div className="grid grid-cols-3 gap-2">
              {energyOptions.map(({ icon: Icon, label, value, color }) => (
                <Button
                  key={value}
                  variant={selectedEnergy === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEnergy(value)}
                  className={`h-12 flex-col space-y-1 ${
                    selectedEnergy === value ? "bg-primary/10 border-primary/30" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!selectedMood || !selectedEnergy}
            className="w-full"
            size="sm"
          >
            Check in anonymously
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}