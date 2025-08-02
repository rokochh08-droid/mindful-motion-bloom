import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Heart } from "lucide-react";

const moodOptions = [
  { icon: Frown, label: "Not great", value: 3, color: "text-red-500" },
  { icon: Meh, label: "Okay", value: 6, color: "text-yellow-500" },
  { icon: Smile, label: "Good", value: 8, color: "text-green-500" },
  { icon: Heart, label: "Amazing", value: 10, color: "text-primary" }
];

interface FeelingCheckInProps {
  onMoodUpdate: (mood: number) => void;
}

export function FeelingCheckIn({ onMoodUpdate }: FeelingCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    onMoodUpdate(mood);
  };

  return (
    <Card className="shadow-card bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-3 text-center">
          How are you feeling right now?
        </h3>
        
        <div className="grid grid-cols-4 gap-2">
          {moodOptions.map(({ icon: Icon, label, value, color }) => (
            <Button
              key={value}
              variant={selectedMood === value ? "default" : "ghost"}
              size="sm"
              onClick={() => handleMoodSelect(value)}
              className={`h-12 flex-col space-y-1 ${
                selectedMood === value 
                  ? "bg-primary/10 border-primary/20" 
                  : "hover:bg-primary/5"
              }`}
            >
              <Icon className={`w-4 h-4 ${selectedMood === value ? "text-primary" : color}`} />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}