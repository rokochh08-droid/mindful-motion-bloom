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
  const initialWorkoutTime = location.state?.workoutTime || 0;
  
  const [exercises, setExercises] = useState<WorkoutExercise[]>(initialExercises);
  const [isActive, setIsActive] = useState(true);
  const [workoutTime, setWorkoutTime] = useState(initialWorkoutTime);
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
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToWorkout}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {/* Clean Timer */}
          <div className="text-center">
            <div className="text-4xl font-light text-foreground">
              {formatTime(workoutTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {currentExerciseIndex >= 0 ? currentExerciseIndex + 1 : exercises.length} of {exercises.length}
            </div>
          </div>

          <div className="w-9" /> {/* Spacer for balance */}
        </div>
      </div>

      <div className="px-6 pb-32">
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
      </div>

      {/* Clean Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-6">
        <div className="max-w-md mx-auto space-y-4">
          <Button 
            variant="ghost"
            onClick={handleAddExercise}
            className="w-full h-12 text-base"
          >
            Add Exercise
          </Button>
          
          <Button 
            onClick={handleFinishWorkout}
            className="w-full h-14 text-lg bg-primary text-primary-foreground"
          >
            Finish Workout
          </Button>
        </div>
      </div>
    </div>
  );
}