import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Dumbbell, 
  Target,
  Smile,
  Meh,
  Frown,
  Zap,
  ChevronRight,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WorkoutExercise {
  id: string;
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
    completed: boolean;
  }>;
}

interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  mood_before: number;
  mood_after: number;
  energy_before: number;
  energy_after: number;
  difficulty: number;
  duration: number;
  notes?: string;
  completed_at: string;
}

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        toast.error("Failed to load workout history");
        console.error(error);
        return;
      }

      setWorkouts(data?.map(workout => ({
        ...workout,
        exercises: (workout.exercises as unknown) as WorkoutExercise[]
      })) || []);
    } catch (error) {
      toast.error("Failed to load workout history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="w-4 h-4 text-success" />;
    if (mood >= 4) return <Meh className="w-4 h-4 text-warning" />;
    return <Frown className="w-4 h-4 text-destructive" />;
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return "text-success";
    if (difficulty <= 6) return "text-warning";
    return "text-destructive";
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalSets = (exercises: WorkoutExercise[]) => {
    return exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4 space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Workout History</h1>
          <p className="text-muted-foreground">Track your fitness journey</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts or exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-primary/20"
          />
        </div>

        {/* Workout List */}
        <div className="space-y-4">
          {filteredWorkouts.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm ? "No workouts found" : "No workouts yet"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "Start logging your workouts to see them here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="shadow-card hover:shadow-lg transition-all">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setExpandedWorkout(
                    expandedWorkout === workout.id ? null : workout.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-primary flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        {workout.name}
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(workout.completed_at)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {workout.duration}m
                        </span>
                        <span className="flex items-center">
                          <Dumbbell className="w-3 h-3 mr-1" />
                          {workout.exercises.length} exercises
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {getMoodIcon(workout.mood_after)}
                        <span className="text-xs">{workout.mood_after}</span>
                      </div>
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          expandedWorkout === workout.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </CardHeader>

                {expandedWorkout === workout.id && (
                  <CardContent className="pt-0 space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Mood Change</div>
                        <div className="flex items-center justify-center space-x-1">
                          {getMoodIcon(workout.mood_before)}
                          <span className="text-xs">→</span>
                          {getMoodIcon(workout.mood_after)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Energy</div>
                        <div className="flex items-center justify-center space-x-1">
                          <Zap className="w-3 h-3 text-accent" />
                          <span className="text-xs">{workout.energy_before}→{workout.energy_after}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Difficulty</div>
                        <div className={`text-sm font-medium ${getDifficultyColor(workout.difficulty)}`}>
                          {workout.difficulty}/10
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Total Sets</div>
                        <div className="text-sm font-medium">
                          {getTotalSets(workout.exercises)}
                        </div>
                      </div>
                    </div>

                    {/* Exercises */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Exercises</h4>
                      {workout.exercises.map((exercise, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/10">
                          <div>
                            <span className="font-medium text-foreground">{exercise.name}</span>
                            <div className="text-xs text-muted-foreground">
                              {exercise.sets.length} sets
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {exercise.sets.map((set, setIdx) => (
                              <Badge 
                                key={setIdx} 
                                variant={set.completed ? "secondary" : "outline"}
                                className="text-xs"
                              >
                                {set.reps}×{set.weight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {workout.notes && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">Notes</h4>
                        <p className="text-sm text-muted-foreground">{workout.notes}</p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}