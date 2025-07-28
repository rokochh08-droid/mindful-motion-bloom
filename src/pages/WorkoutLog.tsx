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
  Play,
  X
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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

  const initiateWorkoutSave = () => {
    if (workoutData.exercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }
    setShowCompletionModal(true);
  };

  const saveWorkout = async () => {
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
      setShowCompletionModal(false);
      
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

        {/* Save Button */}
        {workoutData.exercises.length > 0 && (
          <Button 
            onClick={initiateWorkoutSave}
            className="w-full bg-gradient-success hover:shadow-glow transition-smooth py-6 text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Workout
          </Button>
        )}

        {/* Workout Completion Modal */}
        <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
          <DialogContent className="sm:max-w-lg bg-gradient-to-br from-warm-50 to-green-50 border-warm-200 rounded-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-warm-800 flex items-center">
                  <Smile className="w-6 h-6 mr-2 text-success" />
                  Amazing Work! 
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCompletionModal(false)}
                  className="text-warm-600 hover:text-warm-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-warm-600 mt-1">Let's capture this workout for your journey</p>
            </DialogHeader>
            
            <div className="space-y-6 p-6">
              {/* Workout Name */}
              <div className="space-y-2">
                <Label htmlFor="workout-name-final" className="text-sm font-medium text-warm-700">
                  What should we call this workout? ✨
                </Label>
                <Input
                  id="workout-name-final"
                  type="text"
                  placeholder="e.g., Morning Push Session, Beast Mode Friday..."
                  value={workoutData.name || ""}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl border-warm-200 bg-white/70 focus:border-warm-400 text-warm-800"
                />
              </div>

              {/* Mood After */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-warm-700">How are you feeling now?</Label>
                  <div className="flex items-center space-x-2">
                    {getMoodIcon(workoutData.moodAfter)}
                    <span className="text-sm font-medium text-warm-800">{workoutData.moodAfter}/10</span>
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
              
              {/* Energy After */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-warm-700">Energy Level</Label>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-warm-800">{workoutData.energyAfter}/10</span>
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

              {/* Difficulty */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-warm-700">How challenging was this?</Label>
                  <span className="text-sm font-medium text-warm-800">{workoutData.difficulty}/10</span>
                </div>
                <Slider
                  value={[workoutData.difficulty]}
                  onValueChange={([value]) => setWorkoutData(prev => ({ ...prev, difficulty: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-warm-600">
                  <span>Too Easy</span>
                  <span>Perfect</span>
                  <span>Too Hard</span>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-warm-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  How long did this take? (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={workoutData.duration}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="e.g. 45"
                  className="rounded-xl border-warm-200 bg-white/70 focus:border-warm-400"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-warm-700">
                  Any thoughts to remember? 💭
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Felt stronger today, need more rest between sets, loved this routine..."
                  value={workoutData.notes}
                  onChange={(e) => setWorkoutData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="rounded-xl border-warm-200 bg-white/70 focus:border-warm-400 resize-none"
                />
              </div>

              {/* Save Button */}
              <Button 
                onClick={saveWorkout}
                className="w-full bg-gradient-success hover:shadow-glow transition-smooth py-4 text-lg rounded-xl"
                disabled={!workoutData.name?.trim()}
              >
                <Save className="w-5 h-5 mr-2" />
                Save This Amazing Workout! 🎉
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}