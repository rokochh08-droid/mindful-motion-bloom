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
    <div className="space-y-4">
      {/* Workout Controls */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-6">
              {!isActive && (
                <div className="flex items-center space-x-2 opacity-60">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg font-mono text-muted-foreground">{formatTime(workoutTime)}</span>
                </div>
              )}
              {isActive && (
                <div className="flex items-center space-x-2">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-mono font-bold text-primary">{formatTime(workoutTime)}</span>
                </div>
              )}
              {restTimer > 0 && (
                <Badge variant="outline" className="bg-warning/20 text-warning animate-pulse">
                  Rest: {formatTime(restTimer)}
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <Label className="text-xs text-muted-foreground">Unit:</Label>
                <Select value={weightUnit} onValueChange={(value: 'kg' | 'lb') => setWeightUnit(value)}>
                  <SelectTrigger className="w-16 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isActive ? (
                <Button onClick={onStartWorkout} className="bg-gradient-success">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={onPauseWorkout}>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button onClick={onFinishWorkout} className="bg-gradient-primary">
                    <Square className="w-4 h-4 mr-2" />
                    Finish
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getCompletionProgress())}%</span>
            </div>
            <Progress value={getCompletionProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      {exercises.map((exercise, exerciseIndex) => (
        <Card key={exercise.id} className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">{exercise.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs opacity-60">{exercise.bodyPart}</Badge>
                  <Badge variant="secondary" className="text-xs opacity-60">{exercise.equipment}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExercise(exercise.id)}
                className="text-destructive hover:text-destructive opacity-60 hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {exercise.sets.map((set, setIndex) => (
              <div 
                key={setIndex} 
                className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 ${
                  set.completed 
                    ? 'bg-gradient-to-r from-success/10 to-success/5 border-2 border-success/30 animate-scale-in shadow-success/20 shadow-lg' 
                    : 'bg-card border-2 border-border/50 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center min-w-[60px]">
                    {set.completed ? (
                      <CheckCircle2 className="w-8 h-8 text-success animate-scale-in" />
                    ) : (
                      <span className="text-2xl font-bold text-foreground">
                        {setIndex + 1}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground mt-1">SET</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => updateSet(exercise.id, setIndex, 'reps', Math.max(1, set.reps - 1))}
                          className="w-12 h-12 p-0 touch-manipulation"
                          disabled={set.completed}
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <div className="text-center min-w-[80px]">
                          <div className="text-3xl font-bold text-foreground">{set.reps}</div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">REPS</div>
                        </div>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => updateSet(exercise.id, setIndex, 'reps', set.reps + 1)}
                          className="w-12 h-12 p-0 touch-manipulation"
                          disabled={set.completed}
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => updateSet(exercise.id, setIndex, 'weight', Math.max(0, set.weight - (weightUnit === 'kg' ? 2.5 : 5)))}
                          className="w-12 h-12 p-0 touch-manipulation"
                          disabled={set.completed}
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <div className="text-center min-w-[100px]">
                          <div className="text-3xl font-bold text-foreground">
                            {set.weight}
                            <span className="text-lg text-muted-foreground ml-1">{weightUnit}</span>
                          </div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">WEIGHT</div>
                        </div>
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => updateSet(exercise.id, setIndex, 'weight', set.weight + (weightUnit === 'kg' ? 2.5 : 5))}
                          className="w-12 h-12 p-0 touch-manipulation"
                          disabled={set.completed}
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {!set.completed && (
                    <Button
                      size="lg"
                      onClick={() => completeSet(exercise.id, setIndex)}
                      className="bg-gradient-success hover:scale-105 transition-transform px-8 py-3 text-lg font-semibold"
                    >
                      <CheckCircle2 className="w-6 h-6 mr-2" />
                      Complete
                    </Button>
                  )}
                  
                  {exercise.sets.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSet(exercise.id, setIndex)}
                      className="w-10 h-10 p-0 text-destructive hover:text-destructive opacity-60 hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => addSet(exercise.id)}
              className="w-full mt-4 py-4 text-lg border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Set
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Add Exercise Button - Show when there are exercises */}
      {exercises.length > 0 && onAddExercise && (
        <Card className="shadow-card">
          <CardContent className="p-4">
            <Button 
              onClick={onAddExercise}
              variant="outline"
              className="w-full bg-warm-50 hover:bg-warm-100 border-warm-200 text-warm-700 hover:text-warm-800 rounded-xl border-dashed h-12 animate-fade-in"
            >
              <Dumbbell className="w-5 h-5 mr-2" />
              Add Another Exercise
            </Button>
          </CardContent>
        </Card>
      )}

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