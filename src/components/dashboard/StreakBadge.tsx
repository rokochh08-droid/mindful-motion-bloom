import { Trophy } from "lucide-react";

interface StreakBadgeProps {
  streakDays: number;
}

export function StreakBadge({ streakDays }: StreakBadgeProps) {
  if (streakDays === 0) return null;

  return (
    <div className="inline-flex items-center space-x-1 bg-gradient-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-3 py-1 shadow-soft">
      <Trophy className="w-3 h-3 text-primary" />
      <span className="text-xs font-medium text-primary">
        {streakDays} day{streakDays !== 1 ? 's' : ''}
      </span>
    </div>
  );
}