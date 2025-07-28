import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Minus, 
  Timer, 
  Target,
  CheckCircle2,
  Trash2,
  Dumbbell,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { RestTimer } from "./RestTimer";
import { MeditationRestTimer } from "./MeditationRestTimer";

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

interface WorkoutSessionProps {
  exercises: WorkoutExercise[];
  isActive: boolean;
  onUpdateExercises: (exercises: WorkoutExercise[]) => void;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onFinishWorkout: () => void;
  onAddExercise?: () => void;
}

export function WorkoutSession({ 
  exercises, 
  isActive, 
  onUpdateExercises, 
  onStartWorkout, 
  onPauseWorkout, 
  onFinishWorkout,
  onAddExercise 
}: WorkoutSessionProps) {
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showMeditationTimer, setShowMeditationTimer] = useState(false);
  const [meditationTimerSeconds, setMeditationTimerSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            toast.success("Rest time complete! 💪");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof WorkoutSet, value: any) => {
    const updatedExercises = exercises.map(exercise => 
      exercise.id === exerciseId 
        ? {
            ...exercise,
            sets: exercise.sets.map((set, index) => 
              index === setIndex ? { ...set, [field]: value } : set
            )
          }
        : exercise
    );
    onUpdateExercises(updatedExercises);
  };

  const addSet = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;
    
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      reps: lastSet?.reps || 0,
      weight: lastSet?.weight || 0,
      completed: false
    };

    const updatedExercises = exercises.map(ex => 
      ex.id === exerciseId 
        ? { ...ex, sets: [...ex.sets, newSet] }
        : ex
    );
    onUpdateExercises(updatedExercises);
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    const updatedExercises = exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
        : exercise
    );
    onUpdateExercises(updatedExercises);
  };

  const removeExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
    onUpdateExercises(updatedExercises);
    toast.success("Exercise removed");
  };

  const completeSet = (exerciseId: string, setIndex: number) => {
    updateSet(exerciseId, setIndex, 'completed', true);
    const encouragingMessages = [
      "Great set! 💪",
      "You've got this! 🔥",
      "Beast mode! 🦁",
      "Strong work! ⚡",
      "Crushing it! 🎯"
    ];
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    toast.success(randomMessage);
    setShowRestTimer(true);
  };

  const handleStartRest = (seconds: number) => {
    setMeditationTimerSeconds(seconds);
    setShowMeditationTimer(true);
    setShowRestTimer(false);
  };

  const handleRestComplete = () => {
    setShowMeditationTimer(false);
    toast.success("Rest time complete! 💪");
  };

  const handleExitRest = () => {
    setShowMeditationTimer(false);
  };

  const getCompletionProgress = () => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce((acc, ex) => 
      acc + ex.sets.filter(set => set.completed).length, 0);
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };

  if (exercises.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Exercises */}
      {exercises.map((exercise, exerciseIndex) => (
        <div key={exercise.id} className="space-y-6 pb-8">
          {/* Exercise separator for multiple exercises */}
          {exerciseIndex > 0 && (
            <div className="border-t border-border pt-8 -mt-8" />
          )}
          
          {/* Exercise Name */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-light text-foreground">{exercise.name}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExercise(exercise.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Sets */}
          <div className="space-y-4">
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="space-y-6">
                {/* Set/Reps/Weight Row */}
                <div className="flex items-center justify-center space-x-8">
                  {/* Set Number */}
                  <div className="text-center">
                    {set.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-success mx-auto animate-scale-in" />
                    ) : (
                      <div className="text-4xl font-light text-foreground">{setIndex + 1}</div>
                    )}
                    <div className="text-sm text-muted-foreground mt-1">SET</div>
                  </div>
                  
                  {/* Reps */}
                  <div className="text-center">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => updateSet(exercise.id, setIndex, 'reps', Math.max(1, set.reps - 1))}
                        className="w-14 h-14 p-0 rounded-full"
                        disabled={set.completed}
                      >
                        <Minus className="w-6 h-6" />
                      </Button>
                      <div className="text-center min-w-[80px]">
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(exercise.id, setIndex, 'reps', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 h-16 text-center text-4xl font-light border-none bg-transparent p-0 focus:ring-0"
                          min="1"
                          disabled={set.completed}
                        />
                        <div className="text-sm text-muted-foreground mt-1">REPS</div>
                      </div>
                      <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => updateSet(exercise.id, setIndex, 'reps', set.reps + 1)}
                        className="w-14 h-14 p-0 rounded-full"
                        disabled={set.completed}
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="text-center">
                    <div className="flex items-center space-x-3">
                      <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => updateSet(exercise.id, setIndex, 'weight', Math.max(0, set.weight - (weightUnit === 'kg' ? 2.5 : 5)))}
                        className="w-14 h-14 p-0 rounded-full"
                        disabled={set.completed}
                      >
                        <Minus className="w-6 h-6" />
                      </Button>
                      <div className="text-center min-w-[100px]">
                        <div className="flex items-end justify-center">
                          <Input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(exercise.id, setIndex, 'weight', Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-24 h-16 text-center text-4xl font-light border-none bg-transparent p-0 focus:ring-0"
                            min="0"
                            step={weightUnit === 'kg' ? '2.5' : '5'}
                            disabled={set.completed}
                          />
                          <span className="text-2xl text-muted-foreground ml-1 mb-2">{weightUnit}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">WEIGHT</div>
                      </div>
                      <Button
                        size="lg"
                        variant="ghost"
                        onClick={() => updateSet(exercise.id, setIndex, 'weight', set.weight + (weightUnit === 'kg' ? 2.5 : 5))}
                        className="w-14 h-14 p-0 rounded-full"
                        disabled={set.completed}
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Complete Set Button */}
                {!set.completed && (
                  <div className="text-center">
                    <Button
                      size="lg"
                      onClick={() => completeSet(exercise.id, setIndex)}
                      className="h-14 px-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Complete Set
                    </Button>
                  </div>
                )}

                {/* Remove Set */}
                {exercise.sets.length > 1 && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSet(exercise.id, setIndex)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Remove Set
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Set */}
            <div className="text-center pt-4">
              <Button
                variant="ghost"
                onClick={() => addSet(exercise.id)}
                className="text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Set
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Weight Unit Selector */}
      <div className="text-center">
        <Select value={weightUnit} onValueChange={(value: 'kg' | 'lb') => setWeightUnit(value)}>
          <SelectTrigger className="w-20 h-10 mx-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="lb">lb</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rest Timer Modal */}
      <RestTimer
        isOpen={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        onStartRest={handleStartRest}
      />

      {/* Meditation Rest Timer */}
      {showMeditationTimer && (
        <MeditationRestTimer
          initialSeconds={meditationTimerSeconds}
          onComplete={handleRestComplete}
          onExit={handleExitRest}
        />
      )}
    </div>
  );
}