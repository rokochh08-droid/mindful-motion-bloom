import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface TodaysInsightsProps {
  userName?: string;
  insight: string;
}

export function TodaysInsights({ userName = "Alex", insight }: TodaysInsightsProps) {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/10 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Good morning, {userName}! ✨
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {insight}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}