import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Layout } from "@/components/layout/Layout";
import { 
  Plus, 
  Minus, 
  Save, 
  Search, 
  Smile, 
  Meh, 
  Frown,
  Zap,
  Clock,
  Target
} from "lucide-react";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
  }>;
}

interface WorkoutData {
  exercises: Exercise[];
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

  const [currentExercise, setCurrentExercise] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const commonExercises = [
    "Push-ups", "Pull-ups", "Squats", "Deadlifts", "Bench Press",
    "Overhead Press", "Rows", "Lunges", "Burpees", "Planks",
    "Bicep Curls", "Tricep Dips", "Running", "Walking", "Cycling"
  ];

  const filteredExercises = commonExercises.filter(exercise =>
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addExercise = () => {
    if (!currentExercise) return;
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: currentExercise,
      sets: [{ reps: 0, weight: 0 }]
    };

    setWorkoutData(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
    
    setCurrentExercise("");
    setSearchTerm("");
  };

  const updateExercise = (id: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === id 
          ? {
              ...exercise,
              sets: exercise.sets.map((set, index) => 
                index === setIndex ? { ...set, [field]: value } : set
              )
            }
          : exercise
      )
    }));
  };

  const addSet = (exerciseId: string) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, sets: [...exercise.sets, { reps: 0, weight: 0 }] }
          : exercise
      )
    }));
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
          : exercise
      )
    }));
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="w-5 h-5 text-success" />;
    if (mood >= 4) return <Meh className="w-5 h-5 text-warning" />;
    return <Frown className="w-5 h-5 text-destructive" />;
  };

  const saveWorkout = () => {
    if (workoutData.exercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    // Save to localStorage (in real app, this would be API call)
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const workout = {
      ...workoutData,
      date: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    savedWorkouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(savedWorkouts));

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
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Log Your Workout</h1>
          <p className="text-muted-foreground">Track your progress and feelings</p>
        </div>

        {/* Pre-Workout Mood & Energy */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
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

        {/* Exercise Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Add Exercises</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={addExercise} disabled={!currentExercise}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {searchTerm && (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise}
                    onClick={() => {
                      setCurrentExercise(exercise);
                      setSearchTerm("");
                    }}
                    className="w-full text-left p-2 hover:bg-muted rounded-md text-sm transition-smooth"
                  >
                    {exercise}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercises List */}
        {workoutData.exercises.map((exercise) => (
          <Card key={exercise.id} className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium w-12">Set {setIndex + 1}</span>
                  
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">Reps</Label>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateExercise(exercise.id, setIndex, 'reps', Math.max(0, set.reps - 1))}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateExercise(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateExercise(exercise.id, setIndex, 'reps', set.reps + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">Weight</Label>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateExercise(exercise.id, setIndex, 'weight', Math.max(0, set.weight - 5))}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateExercise(exercise.id, setIndex, 'weight', parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateExercise(exercise.id, setIndex, 'weight', set.weight + 5)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

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

        {/* Post-Workout Mood & Energy */}
        {workoutData.exercises.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Smile className="w-5 h-5 mr-2 text-success" />
                After Your Workout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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