import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Plus, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TodaysInsights } from "@/components/dashboard/TodaysInsights";
import { ReadinessScore } from "@/components/dashboard/ReadinessScore";
import { FeelingCheckIn } from "@/components/dashboard/FeelingCheckIn";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { GoalsSection } from "@/components/dashboard/GoalsSection";

interface DashboardStats {
  streakDays: number;
  weeklyWorkouts: number;
  moodAverage: number;
  energyLevel: number;
}

interface UserData {
  name: string;
  workoutTypes: string[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    streakDays: 0,
    weeklyWorkouts: 0,
    moodAverage: 0,
    energyLevel: 0
  });

  const [userData] = useState<UserData>({
    name: "Alex",
    workoutTypes: ["strength", "cardio", "yoga"]
  });

  useEffect(() => {
    // Load user stats from localStorage or API
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      // Sample data for demo
      setStats({
        streakDays: 5,
        weeklyWorkouts: 3,
        moodAverage: 7.2,
        energyLevel: 8.1
      });
    }
  }, []);

  const generatePersonalInsight = () => {
    const insights = [
      `Your energy is 20% higher after strength days, ${userData.name}`,
      `You're most consistent with workouts on Tuesdays and Thursdays`,
      `Your mood improves by 15% on active recovery days`,
      `Your best workout times seem to be in the morning`,
      `You're building amazing momentum with your routine`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const handleMoodUpdate = (mood: number) => {
    const updatedStats = { ...stats, moodAverage: mood };
    setStats(updatedStats);
    localStorage.setItem('userStats', JSON.stringify(updatedStats));
  };

  return (
    <Layout>
      <div className="p-4 space-y-5">
        {/* Header with Streak Badge */}
        <div className="flex items-center justify-end">
          <StreakBadge streakDays={stats.streakDays} />
        </div>

        {/* Today's Insights Hero Card */}
        <TodaysInsights 
          userName={userData.name}
          insight={generatePersonalInsight()}
        />

        {/* How are you feeling check-in */}
        <FeelingCheckIn onMoodUpdate={handleMoodUpdate} />

        {/* Readiness Score */}
        <ReadinessScore 
          score={Math.round((stats.moodAverage + stats.energyLevel) / 2)}
          moodAverage={stats.moodAverage}
          energyLevel={stats.energyLevel}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => navigate('/workout')}
            className="h-14 bg-gradient-primary hover:shadow-glow transition-smooth group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Start Workout
          </Button>
          <Button 
            onClick={() => navigate('/coach')}
            variant="outline"
            className="h-14 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary hover:shadow-soft transition-smooth group"
          >
            <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Chat with Coach
          </Button>
        </div>

        {/* Goals Section */}
        <GoalsSection />
      </div>
    </Layout>
  );
}