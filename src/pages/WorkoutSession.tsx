import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Timer, 
  CheckCircle2,
  Dumbbell,
  Trophy,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { WorkoutSession as WorkoutSessionComponent } from "@/components/workout/WorkoutSession";

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

export default function WorkoutSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialExercises = location.state?.exercises || [];
  
  const [exercises, setExercises] = useState<WorkoutExercise[]>(initialExercises);
  const [isActive, setIsActive] = useState(true);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [startTime] = useState(Date.now());

  const encouragingMessages = [
    "You're crushing it! 💪",
    "Beast mode activated! 🔥",
    "Unstoppable force! ⚡",
    "Champion mentality! 🏆",
    "Iron will in action! 🦾",
    "Strength unleashed! 💥"
  ];

  const [currentMessage, setCurrentMessage] = useState(
    encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
  );

  useEffect(() => {
    // Rotate encouraging messages every 30 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage(encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]);
    }, 30000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionProgress = () => {
    const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = exercises.reduce((acc, ex) => 
      acc + ex.sets.filter(set => set.completed).length, 0);
    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  };

  const getCurrentExerciseIndex = () => {
    return exercises.findIndex(ex => ex.sets.some(set => !set.completed));
  };

  const getCompletedExercisesCount = () => {
    return exercises.filter(ex => ex.sets.every(set => set.completed)).length;
  };

  const handleUpdateExercises = (updatedExercises: WorkoutExercise[]) => {
    setExercises(updatedExercises);
  };

  const handlePauseWorkout = () => {
    setIsActive(false);
    toast.info("Workout paused");
  };

  const handleResumeWorkout = () => {
    setIsActive(true);
    toast.success("Back to work! 💪");
  };

  const handleFinishWorkout = () => {
    const workoutData = {
      exercises,
      duration: workoutTime,
      completedAt: new Date().toISOString(),
      startedAt: new Date(startTime).toISOString()
    };

    const savedWorkouts = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    savedWorkouts.push(workoutData);
    localStorage.setItem('workoutHistory', JSON.stringify(savedWorkouts));

    toast.success("Workout completed! Amazing work! 🎉");
    navigate('/workout', { state: { workoutCompleted: true } });
  };

  const handleAddExercise = () => {
    navigate('/workout', { 
      state: { 
        returnToSession: true, 
        currentExercises: exercises,
        currentTime: workoutTime 
      } 
    });
  };

  const handleBackToWorkout = () => {
    navigate('/workout');
  };

  const currentExerciseIndex = getCurrentExerciseIndex();
  const completedExercises = getCompletedExercisesCount();
  const progress = getCompletionProgress();

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToWorkout}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Workout Session</h1>
          </div>
          
          <Card className="text-center p-8">
            <CardContent>
              <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold mb-2">No exercises added</h2>
              <p className="text-muted-foreground mb-4">Add some exercises to start your workout!</p>
              <Button onClick={handleBackToWorkout} className="bg-gradient-primary">
                Add Exercises
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToWorkout}
              className="opacity-70 hover:opacity-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-primary" />
                <span className="text-2xl font-mono font-bold text-primary">
                  {formatTime(workoutTime)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Exercise {currentExerciseIndex >= 0 ? currentExerciseIndex + 1 : exercises.length} of {exercises.length}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {completedExercises > 0 && (
                <Badge variant="secondary" className="bg-success/20 text-success">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {completedExercises}
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Workout Progress</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Motivational Message */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {progress < 33 ? (
                <Zap className="w-5 h-5 text-primary" />
              ) : progress < 66 ? (
                <Dumbbell className="w-5 h-5 text-primary" />
              ) : (
                <Trophy className="w-5 h-5 text-warning" />
              )}
              <span className="text-lg font-bold text-primary">{currentMessage}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {progress < 33 
                ? "Just getting started - you've got this!"
                : progress < 66 
                ? "Halfway there - keep pushing!"
                : progress < 100
                ? "Almost done - finish strong!"
                : "Workout complete - you're a champion!"
              }
            </p>
          </CardContent>
        </Card>

        {/* Workout Session Component */}
        <WorkoutSessionComponent
          exercises={exercises}
          isActive={isActive}
          onUpdateExercises={handleUpdateExercises}
          onStartWorkout={handleResumeWorkout}
          onPauseWorkout={handlePauseWorkout}
          onFinishWorkout={handleFinishWorkout}
          onAddExercise={handleAddExercise}
        />

        {/* Bottom Actions */}
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <div className="flex space-x-3">
            {!isActive ? (
              <Button 
                onClick={handleResumeWorkout}
                className="flex-1 bg-gradient-success h-14 text-lg font-semibold"
              >
                <Timer className="w-5 h-5 mr-2" />
                Resume Workout
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={handlePauseWorkout}
                className="flex-1 h-14 text-lg font-semibold"
              >
                Pause
              </Button>
            )}
            
            <Button 
              onClick={handleFinishWorkout}
              className="flex-1 bg-gradient-primary h-14 text-lg font-semibold"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Finish Workout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}