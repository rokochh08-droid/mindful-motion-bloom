import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Layout } from "@/components/layout/Layout";
import { ExerciseLibrary } from "@/components/workout/ExerciseLibrary";
import { WorkoutSession } from "@/components/workout/WorkoutSession";
import { 
  Plus, 
  Save, 
  Smile, 
  Meh, 
  Frown,
  Zap,
  Clock,
  Target,
  Dumbbell,
  Play
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  category: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
  restTime?: number;
}

interface WorkoutExercise extends Exercise {
  sets: WorkoutSet[];
  notes?: string;
}

interface WorkoutData {
  name?: string;
  exercises: WorkoutExercise[];
  moodBefore: number;
  moodAfter: number;
  energyBefore: number;
  energyAfter: number;
  notes: string;
  duration: number;
  difficulty: number;
}

export default function WorkoutLog() {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    exercises: [],
    moodBefore: 5,
    moodAfter: 5,
    energyBefore: 5,
    energyAfter: 5,
    notes: "",
    duration: 0,
    difficulty: 5
  });

  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const addExerciseFromLibrary = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      ...exercise,
      sets: [{ reps: 0, weight: 0, completed: false }]
    };

    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newWorkoutExercise]
    }));
    
    setShowExerciseLibrary(false);
    toast.success(`${exercise.name} added to workout`);
  };

  const updateExercises = (updatedExercises: WorkoutExercise[]) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: updatedExercises
    }));
  };

  const startWorkout = () => {
    setWorkoutActive(true);
    setWorkoutStarted(true);
    toast.success("Workout started! 💪");
  };

  const pauseWorkout = () => {
    setWorkoutActive(false);
    toast.info("Workout paused");
  };

  const finishWorkout = () => {
    setWorkoutActive(false);
    toast.success("Great workout! Time for post-workout tracking 🎉");
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="w-5 h-5 text-success" />;
    if (mood >= 4) return <Meh className="w-5 h-5 text-warning" />;
    return <Frown className="w-5 h-5 text-destructive" />;
  };

  const saveWorkout = async () => {
    if (workoutData.exercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    if (!workoutData.name?.trim()) {
      toast.error("Please enter a workout name");
      return;
    }

    try {
      const { error } = await supabase
        .from('workouts')
        .insert({
          name: workoutData.name,
          exercises: workoutData.exercises as any,
          mood_before: workoutData.moodBefore,
          mood_after: workoutData.moodAfter,
          energy_before: workoutData.energyBefore,
          energy_after: workoutData.energyAfter,
          difficulty: workoutData.difficulty,
          duration: workoutData.duration,
          notes: workoutData.notes || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        toast.error("Failed to save workout");
        console.error(error);
        return;
      }

      toast.success("Workout saved successfully! 🎉");
      
      // Reset form
      setWorkoutData({
        exercises: [],
        moodBefore: 5,
        moodAfter: 5,
        energyBefore: 5,
        energyAfter: 5,
        notes: "",
        duration: 0,
        difficulty: 5
      });
      setWorkoutStarted(false);
    } catch (error) {
      toast.error("Failed to save workout");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {workoutStarted ? "Active Workout" : "Start Your Workout"}
          </h1>
          <p className="text-muted-foreground">
            {workoutStarted ? "Keep pushing forward!" : "Plan and track your session"}
          </p>
        </div>

        {/* Pre-Workout Setup - Only show if workout hasn't started */}
        {!workoutStarted && (
          <>
            <Card className="shadow-card border-primary/10 bg-gradient-calm/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-primary">
                  <Target className="w-5 h-5 mr-2" />
                  Before Your Workout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="workout-name" className="text-sm font-medium text-primary">
                    Workout Name (Optional)
                  </Label>
                  <Input
                    id="workout-name"
                    type="text"
                    placeholder="e.g., Morning Push Workout, Leg Day..."
                    value={workoutData.name || ""}
                    onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 rounded-xl border-primary/20"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Mood</Label>
                    <div className="flex items-center space-x-2">
                      {getMoodIcon(workoutData.moodBefore)}
                      <span className="text-sm font-medium">{workoutData.moodBefore}/10</span>
                    </div>
                  </div>
                  <Slider
                    value={[workoutData.moodBefore]}
                    onValueChange={([value]) => setWorkoutData(prev => ({ ...prev, moodBefore: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Energy Level</Label>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium">{workoutData.energyBefore}/10</span>
                    </div>
                  </div>
                  <Slider
                    value={[workoutData.energyBefore]}
                    onValueChange={([value]) => setWorkoutData(prev => ({ ...prev, energyBefore: value }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Exercise Library Button */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <Button 
                  onClick={() => setShowExerciseLibrary(true)} 
                  className="w-full bg-gradient-primary h-12"
                >
                  <Dumbbell className="w-5 h-5 mr-2" />
                  Browse Exercise Library
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Exercise Library Modal */}
        {showExerciseLibrary && (
          <ExerciseLibrary 
            onSelectExercise={addExerciseFromLibrary}
            onClose={() => setShowExerciseLibrary(false)}
          />
        )}

        {/* Workout Session */}
        <WorkoutSession
          exercises={workoutData.exercises}
          isActive={workoutActive}
          onUpdateExercises={updateExercises}
          onStartWorkout={startWorkout}
          onPauseWorkout={pauseWorkout}
          onFinishWorkout={finishWorkout}
          onAddExercise={() => setShowExerciseLibrary(true)}
        />

        {/* Post-Workout Completion - Only show after workout is finished */}
        {!workoutActive && workoutStarted && workoutData.exercises.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Smile className="w-5 h-5 mr-2 text-success" />
                Complete Your Workout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workout-name-final" className="text-sm font-medium text-primary">
                  Workout Name *
                </Label>
                <Input
                  id="workout-name-final"
                  type="text"
                  placeholder="e.g., Morning Push Workout, Leg Day..."
                  value={workoutData.name || ""}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 rounded-xl border-primary/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Mood</Label>
                  <div className="flex items-center space-x-2">
                    {getMoodIcon(workoutData.moodAfter)}
                    <span className="text-sm font-medium">{workoutData.moodAfter}/10</span>
                  </div>
                </div>
                <Slider
                  value={[workoutData.moodAfter]}
                  onValueChange={([value]) => setWorkoutData(prev => ({ ...prev, moodAfter: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="mb-2"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Energy Level</Label>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{workoutData.energyAfter}/10</span>
                  </div>
                </div>
                <Slider
                  value={[workoutData.energyAfter]}
                  onValueChange={([value]) => setWorkoutData(prev => ({ ...prev, energyAfter: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="mb-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>How did this feel?</Label>
                  <span className="text-sm font-medium">{workoutData.difficulty}/10</span>
                </div>
                <Slider
                  value={[workoutData.difficulty]}
                  onValueChange={([value]) => setWorkoutData(prev => ({ ...prev, difficulty: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Too Easy</span>
                  <span>Perfect</span>
                  <span>Too Hard</span>
                </div>
              </div>

              <div>
                <Label htmlFor="duration" className="flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={workoutData.duration}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g. 45"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How did you feel? Any insights or observations?"
                  value={workoutData.notes}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        {workoutData.exercises.length > 0 && (
          <Button 
            onClick={saveWorkout}
            className="w-full bg-gradient-success hover:shadow-glow transition-smooth py-6 text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Workout
          </Button>
        )}
      </div>
    </Layout>
  );
}