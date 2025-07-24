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
  Trash2
} from "lucide-react";
import { toast } from "sonner";

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
}

export function WorkoutSession({ 
  exercises, 
  isActive, 
  onUpdateExercises, 
  onStartWorkout, 
  onPauseWorkout, 
  onFinishWorkout 
}: WorkoutSessionProps) {
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');

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
    setRestTimer(90); // Start 90 second rest timer
    toast.success("Set completed! 🎯");
  };

  const getCompletionProgress = () => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce((acc, ex) => 
      acc + ex.sets.filter(set => set.completed).length, 0);
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };

  if (exercises.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="text-center py-8">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Ready to Start?</h3>
          <p className="text-muted-foreground mb-4">
            Add exercises to begin your workout session
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workout Controls */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-primary" />
                <span className="text-2xl font-mono font-bold">{formatTime(workoutTime)}</span>
              </div>
              {restTimer > 0 && (
                <Badge variant="outline" className="bg-warning/20 text-warning">
                  Rest: {formatTime(restTimer)}
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <Label className="text-xs text-muted-foreground">Weight Unit:</Label>
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
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{exercise.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">{exercise.bodyPart}</Badge>
                  <Badge variant="outline" className="text-xs">{exercise.equipment}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExercise(exercise.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {exercise.sets.map((set, setIndex) => (
              <div 
                key={setIndex} 
                className={`flex items-center space-x-3 p-3 rounded-lg transition-smooth ${
                  set.completed ? 'bg-success/10 border border-success/20' : 'bg-muted'
                }`}
              >
                <span className="text-sm font-medium w-12">
                  {set.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    `Set ${setIndex + 1}`
                  )}
                </span>
                
                <div className="flex items-center space-x-2">
                  <Label className="text-xs">Reps</Label>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSet(exercise.id, setIndex, 'reps', Math.max(0, set.reps - 1))}
                      className="w-8 h-8 p-0"
                      disabled={set.completed}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                      disabled={set.completed}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSet(exercise.id, setIndex, 'reps', set.reps + 1)}
                      className="w-8 h-8 p-0"
                      disabled={set.completed}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-muted-foreground">Weight ({weightUnit})</Label>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSet(exercise.id, setIndex, 'weight', Math.max(0, set.weight - (weightUnit === 'kg' ? 2.5 : 5)))}
                      className="w-8 h-8 p-0"
                      disabled={set.completed}
                      title={`Decrease by ${weightUnit === 'kg' ? '2.5' : '5'} ${weightUnit}`}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <div className="relative">
                      <Input
                        type="number"
                        step={weightUnit === 'kg' ? '2.5' : '5'}
                        value={set.weight}
                        onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-20 text-center pr-8"
                        disabled={set.completed}
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                        {weightUnit}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSet(exercise.id, setIndex, 'weight', set.weight + (weightUnit === 'kg' ? 2.5 : 5))}
                      className="w-8 h-8 p-0"
                      disabled={set.completed}
                      title={`Increase by ${weightUnit === 'kg' ? '2.5' : '5'} ${weightUnit}`}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!set.completed && (
                    <Button
                      size="sm"
                      onClick={() => completeSet(exercise.id, setIndex)}
                      className="bg-gradient-success"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {exercise.sets.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSet(exercise.id, setIndex)}
                      className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSet(exercise.id)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Set
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}