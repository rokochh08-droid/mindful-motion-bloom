import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, Trophy, TrendingUp } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  weeklyGoal: number;
  weeklyCompleted: number;
  lastWorkoutDate: string;
  workoutDates: string[];
}

export function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalWorkouts: 0,
    weeklyGoal: 4,
    weeklyCompleted: 3,
    lastWorkoutDate: '',
    workoutDates: []
  });

  useEffect(() => {
    const savedStreaks = localStorage.getItem('streakData');
    if (savedStreaks) {
      setStreakData(JSON.parse(savedStreaks));
    } else {
      // Sample data
      const sampleData: StreakData = {
        currentStreak: 7,
        longestStreak: 12,
        totalWorkouts: 45,
        weeklyGoal: 4,
        weeklyCompleted: 3,
        lastWorkoutDate: new Date().toISOString().split('T')[0],
        workoutDates: [
          new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ]
      };
      setStreakData(sampleData);
      localStorage.setItem('streakData', JSON.stringify(sampleData));
    }
  }, []);

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: "Legend", color: "bg-gradient-to-r from-purple-500 to-pink-500", emoji: "👑" };
    if (streak >= 21) return { level: "Master", color: "bg-gradient-to-r from-orange-500 to-red-500", emoji: "🏆" };
    if (streak >= 14) return { level: "Pro", color: "bg-gradient-to-r from-blue-500 to-cyan-500", emoji: "💪" };
    if (streak >= 7) return { level: "Strong", color: "bg-gradient-to-r from-green-500 to-emerald-500", emoji: "🔥" };
    if (streak >= 3) return { level: "Building", color: "bg-gradient-to-r from-yellow-500 to-orange-500", emoji: "⚡" };
    return { level: "Starting", color: "bg-gradient-to-r from-gray-400 to-gray-500", emoji: "🌱" };
  };

  const streakLevel = getStreakLevel(streakData.currentStreak);
  const weeklyProgress = (streakData.weeklyCompleted / streakData.weeklyGoal) * 100;

  // Generate last 30 days for visualization
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasWorkout = streakData.workoutDates.includes(dateStr);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      const dayNumber = date.getDate();
      
      days.push({
        date: dateStr,
        hasWorkout,
        dayName: dayName[0], // First letter only
        dayNumber,
        isToday: dateStr === new Date().toISOString().split('T')[0]
      });
    }
    return days;
  };

  const last30Days = getLast30Days();

  return (
    <div className="space-y-4">
      {/* Main Streak Card */}
      <Card className="shadow-card overflow-hidden">
        <div className={`h-2 ${streakLevel.color}`}></div>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Flame className="w-5 h-5 mr-2 text-accent" />
              Streak Tracker
            </div>
            <Badge className={`${streakLevel.color} text-white border-0`}>
              {streakLevel.emoji} {streakLevel.level}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Streak */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-foreground">
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">
              Day{streakData.currentStreak !== 1 ? 's' : ''} in a row
            </div>
            {streakData.currentStreak > 0 && (
              <div className="text-xs text-success">
                🎉 Keep it up! You're building an amazing habit!
              </div>
            )}
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Trophy className="w-5 h-5 mx-auto text-accent" />
              <div className="text-lg font-bold text-foreground">{streakData.longestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div className="space-y-1">
              <TrendingUp className="w-5 h-5 mx-auto text-success" />
              <div className="text-lg font-bold text-foreground">{streakData.totalWorkouts}</div>
              <div className="text-xs text-muted-foreground">Total Workouts</div>
            </div>
            <div className="space-y-1">
              <Calendar className="w-5 h-5 mx-auto text-primary" />
              <div className="text-lg font-bold text-foreground">{streakData.weeklyCompleted}/{streakData.weeklyGoal}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>

          {/* 30-Day Activity Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Last 30 Days</h4>
            <div className="grid grid-cols-10 gap-1">
              {last30Days.map((day, index) => (
                <div key={day.date} className="flex flex-col items-center space-y-1">
                  {/* Day indicator - only show for every 5th day to avoid clutter */}
                  {index % 5 === 0 && (
                    <div className="text-xs text-muted-foreground h-4">
                      {day.dayNumber}
                    </div>
                  )}
                  {index % 5 !== 0 && <div className="h-4"></div>}
                  
                  {/* Activity indicator */}
                  <div 
                    className={`w-3 h-3 rounded-sm transition-all ${
                      day.hasWorkout 
                        ? 'bg-success shadow-soft' 
                        : day.isToday 
                          ? 'bg-muted border-2 border-primary' 
                          : 'bg-muted'
                    }`}
                    title={`${day.date}${day.hasWorkout ? ' - Workout completed!' : ''}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-muted rounded-sm"></div>
                <div className="w-2 h-2 bg-success/30 rounded-sm"></div>
                <div className="w-2 h-2 bg-success/60 rounded-sm"></div>
                <div className="w-2 h-2 bg-success rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}