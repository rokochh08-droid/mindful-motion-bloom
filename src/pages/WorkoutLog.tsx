import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  X,
  Calendar,
  ChevronRight,
  Search,
  History
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

interface SavedWorkout {
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
  const navigate = useNavigate();
  const location = useLocation();
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
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  useEffect(() => {
    loadSavedWorkouts();
    
    // Check if returning from workout session with completed workout
    if (location.state?.workoutCompleted) {
      loadSavedWorkouts(); // Refresh workout history
      toast.success("Welcome back! Your workout has been saved 🎉");
    }
  }, [location.state]);

  const loadSavedWorkouts = () => {
    const saved = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
    setSavedWorkouts(saved);
  };

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
    if (mood >= 7) return <Smile className="w-4 h-4 text-success" />;
    if (mood >= 4) return <Meh className="w-4 h-4 text-warning" />;
    return <Frown className="w-4 h-4 text-destructive" />;
  };

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

  const filteredWorkouts = savedWorkouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

    // Save to localStorage for now
    const workoutToSave = {
      id: crypto.randomUUID(),
      name: workoutData.name,
      exercises: workoutData.exercises,
      mood_before: workoutData.moodBefore,
      mood_after: workoutData.moodAfter,
      energy_before: workoutData.energyBefore,
      energy_after: workoutData.energyAfter,
      difficulty: workoutData.difficulty,
      duration: workoutData.duration,
      notes: workoutData.notes || null,
      completed_at: new Date().toISOString()
    };

    const savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
    savedWorkouts.unshift(workoutToSave);
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));

    toast.success("Workout saved successfully! 🎉");
    setShowCompletionModal(false);
    loadSavedWorkouts(); // Refresh the workout history
    
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
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {workoutStarted ? "Active Workout" : "Workout"}
          </h1>
          <p className="text-muted-foreground">
            {workoutStarted ? "Keep pushing forward!" : "Plan and track your sessions"}
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current" className="flex items-center">
              <Dumbbell className="w-4 h-4 mr-2" />
              Current Workout
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6 mt-6">

        {/* Always show exercise library when no workout is active */}
        {!workoutStarted && !showExerciseLibrary && (
          <ExerciseLibrary 
            onSelectExercise={(exercise) => {
              const newWorkoutExercise: WorkoutExercise = {
                ...exercise,
                sets: [{ reps: 0, weight: 0, completed: false }]
              };
              // Go directly to workout session
              navigate('/workout/session', { state: { exercises: [newWorkoutExercise] } });
            }}
            onClose={() => navigate('/')}
          />
        )}


        {/* Workout Completion Modal */}
        <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
          <DialogContent className="sm:max-w-lg bg-gradient-to-br from-warm-50 to-green-50 border-warm-200 rounded-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-warm-800 flex items-center">
                  <Smile className="w-6 h-6 mr-2 text-success" />
                  Great Session! 
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
              <p className="text-warm-600 mt-1">Let's capture this workout for your journey.</p>
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
                Save Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
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

            {/* Workout History List */}
            <div className="space-y-4">
              {filteredWorkouts.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="p-8 text-center">
                    <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
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
                            <div className="text-sm font-medium text-warning">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}