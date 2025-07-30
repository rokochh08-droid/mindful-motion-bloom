import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Plus, Heart } from "lucide-react";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  category: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface ExerciseLibraryProps {
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

// Comprehensive exercise database with 100+ exercises
const exerciseDatabase: Exercise[] = [
  // Chest exercises
  { id: "1", name: "Push-ups", bodyPart: "Chest", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "2", name: "Bench Press", bodyPart: "Chest", category: "Strength", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "3", name: "Incline Dumbbell Press", bodyPart: "Chest", category: "Strength", equipment: "Dumbbells", difficulty: "Intermediate" },
  { id: "4", name: "Chest Fly", bodyPart: "Chest", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "5", name: "Dips", bodyPart: "Chest", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "6", name: "Cable Crossover", bodyPart: "Chest", category: "Strength", equipment: "Cable", difficulty: "Intermediate" },
  { id: "7", name: "Diamond Push-ups", bodyPart: "Chest", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "8", name: "Decline Bench Press", bodyPart: "Chest", category: "Strength", equipment: "Barbell", difficulty: "Advanced" },

  // Back exercises
  { id: "9", name: "Pull-ups", bodyPart: "Back", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "10", name: "Lat Pulldown", bodyPart: "Back", category: "Strength", equipment: "Cable", difficulty: "Beginner" },
  { id: "11", name: "Bent Over Row", bodyPart: "Back", category: "Strength", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "12", name: "Deadlift", bodyPart: "Back", category: "Strength", equipment: "Barbell", difficulty: "Advanced" },
  { id: "13", name: "T-Bar Row", bodyPart: "Back", category: "Strength", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "14", name: "Seated Cable Row", bodyPart: "Back", category: "Strength", equipment: "Cable", difficulty: "Beginner" },
  { id: "15", name: "Single Arm Dumbbell Row", bodyPart: "Back", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "16", name: "Face Pulls", bodyPart: "Back", category: "Strength", equipment: "Cable", difficulty: "Beginner" },
  { id: "17", name: "Reverse Fly", bodyPart: "Back", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },

  // Shoulders exercises
  { id: "18", name: "Overhead Press", bodyPart: "Shoulders", category: "Strength", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "19", name: "Lateral Raises", bodyPart: "Shoulders", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "20", name: "Front Raises", bodyPart: "Shoulders", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "21", name: "Rear Delt Fly", bodyPart: "Shoulders", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "22", name: "Arnold Press", bodyPart: "Shoulders", category: "Strength", equipment: "Dumbbells", difficulty: "Intermediate" },
  { id: "23", name: "Pike Push-ups", bodyPart: "Shoulders", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "24", name: "Upright Row", bodyPart: "Shoulders", category: "Strength", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "25", name: "Handstand Push-ups", bodyPart: "Shoulders", category: "Strength", equipment: "Bodyweight", difficulty: "Advanced" },

  // Arms exercises
  { id: "26", name: "Bicep Curls", bodyPart: "Arms", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "27", name: "Tricep Dips", bodyPart: "Arms", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "28", name: "Hammer Curls", bodyPart: "Arms", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "29", name: "Tricep Extensions", bodyPart: "Arms", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "30", name: "Chin-ups", bodyPart: "Arms", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "31", name: "Cable Curls", bodyPart: "Arms", category: "Strength", equipment: "Cable", difficulty: "Beginner" },
  { id: "32", name: "Close Grip Bench Press", bodyPart: "Arms", category: "Strength", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "33", name: "Preacher Curls", bodyPart: "Arms", category: "Strength", equipment: "Dumbbells", difficulty: "Intermediate" },

  // Legs exercises
  { id: "34", name: "Squats", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "35", name: "Lunges", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "36", name: "Leg Press", bodyPart: "Legs", category: "Strength", equipment: "Machine", difficulty: "Beginner" },
  { id: "37", name: "Calf Raises", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "38", name: "Romanian Deadlift", bodyPart: "Legs", category: "Strength", equipment: "Barbell", difficulty: "Intermediate" },
  { id: "39", name: "Bulgarian Split Squats", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "40", name: "Leg Curls", bodyPart: "Legs", category: "Strength", equipment: "Machine", difficulty: "Beginner" },
  { id: "41", name: "Leg Extensions", bodyPart: "Legs", category: "Strength", equipment: "Machine", difficulty: "Beginner" },
  { id: "42", name: "Goblet Squats", bodyPart: "Legs", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "43", name: "Walking Lunges", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "44", name: "Single Leg Deadlift", bodyPart: "Legs", category: "Strength", equipment: "Dumbbells", difficulty: "Intermediate" },
  { id: "45", name: "Box Jumps", bodyPart: "Legs", category: "Cardio", equipment: "Bodyweight", difficulty: "Intermediate" },

  // Core exercises
  { id: "46", name: "Plank", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "47", name: "Crunches", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "48", name: "Russian Twists", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "49", name: "Mountain Climbers", bodyPart: "Core", category: "Cardio", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "50", name: "Dead Bug", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "51", name: "Bicycle Crunches", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "52", name: "Side Plank", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "53", name: "Hanging Leg Raises", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Advanced" },
  { id: "54", name: "Ab Wheel Rollout", bodyPart: "Core", category: "Strength", equipment: "Equipment", difficulty: "Advanced" },
  { id: "55", name: "Hollow Body Hold", bodyPart: "Core", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },

  // Cardio exercises
  { id: "56", name: "Jumping Jacks", bodyPart: "Full Body", category: "Cardio", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "57", name: "Burpees", bodyPart: "Full Body", category: "Cardio", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "58", name: "High Knees", bodyPart: "Full Body", category: "Cardio", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "59", name: "Butt Kickers", bodyPart: "Full Body", category: "Cardio", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "60", name: "Running in Place", bodyPart: "Full Body", category: "Cardio", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "61", name: "Jump Rope", bodyPart: "Full Body", category: "Cardio", equipment: "Equipment", difficulty: "Beginner" },
  { id: "62", name: "Treadmill Running", bodyPart: "Full Body", category: "Cardio", equipment: "Machine", difficulty: "Beginner" },
  { id: "63", name: "Stationary Bike", bodyPart: "Full Body", category: "Cardio", equipment: "Machine", difficulty: "Beginner" },
  { id: "64", name: "Elliptical", bodyPart: "Full Body", category: "Cardio", equipment: "Machine", difficulty: "Beginner" },
  { id: "65", name: "Rowing Machine", bodyPart: "Full Body", category: "Cardio", equipment: "Machine", difficulty: "Beginner" },

  // Full Body exercises
  { id: "66", name: "Thrusters", bodyPart: "Full Body", category: "Strength", equipment: "Dumbbells", difficulty: "Intermediate" },
  { id: "67", name: "Clean and Press", bodyPart: "Full Body", category: "Strength", equipment: "Barbell", difficulty: "Advanced" },
  { id: "68", name: "Turkish Get-ups", bodyPart: "Full Body", category: "Strength", equipment: "Dumbbells", difficulty: "Advanced" },
  { id: "69", name: "Bear Crawl", bodyPart: "Full Body", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "70", name: "Kettlebell Swings", bodyPart: "Full Body", category: "Strength", equipment: "Equipment", difficulty: "Intermediate" },
  { id: "71", name: "Man Makers", bodyPart: "Full Body", category: "Strength", equipment: "Dumbbells", difficulty: "Advanced" },
  { id: "72", name: "Medicine Ball Slams", bodyPart: "Full Body", category: "Strength", equipment: "Equipment", difficulty: "Intermediate" },

  // Stretching/Flexibility
  { id: "73", name: "Downward Dog", bodyPart: "Full Body", category: "Flexibility", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "74", name: "Child's Pose", bodyPart: "Back", category: "Flexibility", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "75", name: "Pigeon Pose", bodyPart: "Legs", category: "Flexibility", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "76", name: "Cat-Cow Stretch", bodyPart: "Back", category: "Flexibility", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "77", name: "Standing Forward Fold", bodyPart: "Legs", category: "Flexibility", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "78", name: "Seated Spinal Twist", bodyPart: "Core", category: "Flexibility", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "79", name: "Hip Flexor Stretch", bodyPart: "Legs", category: "Flexibility", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "80", name: "Shoulder Rolls", bodyPart: "Shoulders", category: "Flexibility", equipment: "Bodyweight", difficulty: "Beginner" },

  // Additional strength exercises
  { id: "81", name: "Farmer's Walk", bodyPart: "Full Body", category: "Strength", equipment: "Dumbbells", difficulty: "Intermediate" },
  { id: "82", name: "Wall Sit", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "83", name: "Superman", bodyPart: "Back", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "84", name: "Glute Bridges", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "85", name: "Step-ups", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "86", name: "Tricep Kickbacks", bodyPart: "Arms", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "87", name: "Concentration Curls", bodyPart: "Arms", category: "Strength", equipment: "Dumbbells", difficulty: "Beginner" },
  { id: "88", name: "Reverse Lunges", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "89", name: "Incline Push-ups", bodyPart: "Chest", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "90", name: "Decline Push-ups", bodyPart: "Chest", category: "Strength", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "91", name: "Sumo Squats", bodyPart: "Legs", category: "Strength", equipment: "Bodyweight", difficulty: "Beginner" },
  { id: "92", name: "Jump Squats", bodyPart: "Legs", category: "Cardio", equipment: "Bodyweight", difficulty: "Intermediate" },
  { id: "93", name: "Chest Press Machine", bodyPart: "Chest", category: "Strength", equipment: "Machine", difficulty: "Beginner" },
  { id: "94", name: "Shoulder Press Machine", bodyPart: "Shoulders", category: "Strength", equipment: "Machine", difficulty: "Beginner" },
  { id: "95", name: "Lat Pulldown Machine", bodyPart: "Back", category: "Strength", equipment: "Machine", difficulty: "Beginner" },
  { id: "96", name: "Leg Press Machine", bodyPart: "Legs", category: "Strength", equipment: "Machine", difficulty: "Beginner" },
  { id: "97", name: "Cable Flyes", bodyPart: "Chest", category: "Strength", equipment: "Cable", difficulty: "Intermediate" },
  { id: "98", name: "Cable Lateral Raises", bodyPart: "Shoulders", category: "Strength", equipment: "Cable", difficulty: "Intermediate" },
  { id: "99", name: "Cable Tricep Pushdowns", bodyPart: "Arms", category: "Strength", equipment: "Cable", difficulty: "Beginner" },
  { id: "100", name: "Cable Bicep Curls", bodyPart: "Arms", category: "Strength", equipment: "Cable", difficulty: "Beginner" },
];

export function ExerciseLibrary({ onSelectExercise, onClose }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("All");
  const [customExerciseName, setCustomExerciseName] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = selectedBodyPart === 'All' || exercise.bodyPart === selectedBodyPart;
    return matchesSearch && matchesBodyPart;
  });

  const createCustomExercise = () => {
    if (!customExerciseName.trim()) return;
    
    const customExercise: Exercise = {
      id: `custom-${Date.now()}`,
      name: customExerciseName.trim(),
      bodyPart: selectedBodyPart === "All" ? "Full Body" : selectedBodyPart,
      category: "Strength",
      equipment: "Custom",
      difficulty: "Beginner"
    };
    
    onSelectExercise(customExercise);
    setCustomExerciseName("");
    setShowCustomForm(false);
    toast.success(`Created "${customExercise.name}" exercise! 💪`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success-light text-success-foreground';
      case 'Intermediate': return 'bg-warning/20 text-warning-foreground';
      case 'Advanced': return 'bg-accent-light text-accent-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">Exercise Library</CardTitle>
            <p className="text-sm text-muted-foreground">Choose exercises for your workout</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowCustomForm(!showCustomForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Exercise
            </Button>
            
            {showCustomForm && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="space-y-3">
                  <Input
                    placeholder="Enter exercise name..."
                    value={customExerciseName}
                    onChange={(e) => setCustomExerciseName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createCustomExercise()}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={createCustomExercise}
                      disabled={!customExerciseName.trim()}
                      size="sm"
                    >
                      Add Exercise
                    </Button>
                    <Button
                      onClick={() => {
                        setShowCustomForm(false);
                        setCustomExerciseName("");
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Tabs value={selectedBodyPart} onValueChange={setSelectedBodyPart} className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Chest">Chest</TabsTrigger>
                <TabsTrigger value="Back">Back</TabsTrigger>
                <TabsTrigger value="Shoulders">Shoulders</TabsTrigger>
                <TabsTrigger value="Arms">Arms</TabsTrigger>
                <TabsTrigger value="Legs">Legs</TabsTrigger>
                <TabsTrigger value="Core">Core</TabsTrigger>
                <TabsTrigger value="Full Body">Cardio</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {filteredExercises.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-2">No exercises found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or create a custom exercise</p>
                      </div>
                    ) : (
                      filteredExercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => {
                            onSelectExercise(exercise);
                            toast.success(`Added ${exercise.name} to your workout!`);
                          }}
                        >
                          <div className="flex-1">
                            <h3 className="font-medium">{exercise.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {exercise.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {exercise.equipment}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {exercise.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="default">
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}