import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Flame,
  Activity,
  Heart,
  Zap,
  ChevronRight,
  Star
} from "lucide-react";

interface WorkoutData {
  date: string;
  exercises: any[];
  moodBefore: number;
  moodAfter: number;
  energyBefore: number;
  energyAfter: number;
  duration: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  unlockedDate?: Date;
  progress?: number;
  target?: number;
}

export default function Progress() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Load workout data
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    setWorkouts(savedWorkouts);

    // Initialize achievements
    const allAchievements: Achievement[] = [
      {
        id: 'first_workout',
        title: 'First Step',
        description: 'Complete your first workout',
        icon: Target,
        unlocked: savedWorkouts.length > 0,
        unlockedDate: savedWorkouts.length > 0 ? new Date(savedWorkouts[0].date) : undefined
      },
      {
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Work out 7 days in a row',
        icon: Flame,
        unlocked: false,
        progress: 5,
        target: 7
      },
      {
        id: 'mood_booster',
        title: 'Mood Booster',
        description: 'Improve your mood 10 times',
        icon: Heart,
        unlocked: false,
        progress: 7,
        target: 10
      },
      {
        id: 'consistency_king',
        title: 'Consistency Champion',
        description: 'Log workouts 30 days',
        icon: Calendar,
        unlocked: false,
        progress: savedWorkouts.length,
        target: 30
      },
      {
        id: 'strength_gain',
        title: 'Getting Stronger',
        description: 'Increase weight on any exercise',
        icon: TrendingUp,
        unlocked: true,
        unlockedDate: new Date()
      },
      {
        id: 'energy_boost',
        title: 'Energy Booster',
        description: 'Feel more energized after 5 workouts',
        icon: Zap,
        unlocked: false,
        progress: 3,
        target: 5
      }
    ];
    setAchievements(allAchievements);
  }, []);

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekAgo);
    
    const avgMoodImprovement = weekWorkouts.length > 0 
      ? weekWorkouts.reduce((sum, w) => sum + (w.moodAfter - w.moodBefore), 0) / weekWorkouts.length
      : 0;
    
    const avgEnergyImprovement = weekWorkouts.length > 0
      ? weekWorkouts.reduce((sum, w) => sum + (w.energyAfter - w.energyBefore), 0) / weekWorkouts.length
      : 0;
    
    const totalDuration = weekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    
    return {
      workoutCount: weekWorkouts.length,
      avgMoodImprovement,
      avgEnergyImprovement,
      totalDuration
    };
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthWorkouts = workouts.filter(w => new Date(w.date) >= monthAgo);
    
    return {
      workoutCount: monthWorkouts.length,
      totalExercises: monthWorkouts.reduce((sum, w) => sum + w.exercises.length, 0),
      avgMood: monthWorkouts.length > 0 
        ? monthWorkouts.reduce((sum, w) => sum + w.moodAfter, 0) / monthWorkouts.length
        : 0
    };
  };

  const weekStats = getWeeklyStats();
  const monthStats = getMonthlyStats();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
          <p className="text-muted-foreground">Celebrating every step forward</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="achievements">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Activity className="w-6 h-6 text-success mr-2" />
                    <span className="text-2xl font-bold text-foreground">{workouts.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="w-6 h-6 text-accent mr-2" />
                    <span className="text-2xl font-bold text-foreground">5</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Summary */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-foreground">{weekStats.workoutCount}</div>
                    <div className="text-sm text-muted-foreground">Workouts</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold text-foreground">{Math.round(weekStats.totalDuration)}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Mood Improvement</span>
                      <span className="text-foreground">+{weekStats.avgMoodImprovement.toFixed(1)}</span>
                    </div>
                    <ProgressBar 
                      value={Math.max(0, weekStats.avgMoodImprovement * 20)} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Energy Boost</span>
                      <span className="text-foreground">+{weekStats.avgEnergyImprovement.toFixed(1)}</span>
                    </div>
                    <ProgressBar 
                      value={Math.max(0, weekStats.avgEnergyImprovement * 20)} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Progress */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-success" />
                  Monthly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-foreground">{monthStats.workoutCount}</div>
                    <div className="text-xs text-muted-foreground">Workouts</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{monthStats.totalExercises}</div>
                    <div className="text-xs text-muted-foreground">Exercises</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{monthStats.avgMood.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Avg Mood</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Mood vs Energy Correlation */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-accent" />
                  Mood & Energy Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-calm rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Key Insight</h3>
                    <p className="text-sm text-muted-foreground">
                      Your mood improves by an average of +2.1 points after workouts, 
                      and your energy levels increase by +1.8 points. Strength training 
                      shows the biggest mood boost!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <div className="text-lg font-bold text-success">85%</div>
                      <div className="text-sm text-muted-foreground">of workouts improve mood</div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <div className="text-lg font-bold text-primary">92%</div>
                      <div className="text-sm text-muted-foreground">boost energy levels</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Pattern */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Weekly Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={day} className="p-2">
                      <div className="text-xs text-muted-foreground mb-2">{day}</div>
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs ${
                        [0, 2, 4, 6].includes(index) 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {[0, 2, 4, 6].includes(index) ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  You're most consistent on weekends and Tuesdays. Consider planning easier workouts for Mondays.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {/* Unlocked Achievements */}
            {unlockedAchievements.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-accent" />
                    Earned Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {unlockedAchievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className="flex items-center space-x-3 p-3 bg-gradient-success rounded-lg"
                      >
                        <div className="w-12 h-12 bg-success-foreground rounded-full flex items-center justify-center">
                          <achievement.icon className="w-6 h-6 text-success" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-success-foreground">{achievement.title}</h3>
                          <p className="text-sm text-success-foreground/80">{achievement.description}</p>
                          {achievement.unlockedDate && (
                            <p className="text-xs text-success-foreground/60 mt-1">
                              Earned {achievement.unlockedDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Award className="w-5 h-5 text-success-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* In Progress Achievements */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {lockedAchievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
                    >
                      <div className="w-12 h-12 bg-muted-foreground/10 rounded-full flex items-center justify-center">
                        <achievement.icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.progress && achievement.target && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-foreground">{achievement.progress}/{achievement.target}</span>
                            </div>
                            <ProgressBar 
                              value={(achievement.progress / achievement.target) * 100} 
                              className="h-2" 
                            />
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}