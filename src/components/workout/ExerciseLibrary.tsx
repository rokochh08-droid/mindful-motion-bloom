import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Dumbbell, Target } from "lucide-react";

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

const exerciseDatabase: Exercise[] = [
  // Chest
  { id: '1', name: 'Bench Press', bodyPart: 'Chest', category: 'Compound', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '2', name: 'Push-ups', bodyPart: 'Chest', category: 'Bodyweight', equipment: 'None', difficulty: 'Beginner' },
  { id: '3', name: 'Dumbbell Flyes', bodyPart: 'Chest', category: 'Isolation', equipment: 'Dumbbells', difficulty: 'Intermediate' },
  { id: '4', name: 'Incline Bench Press', bodyPart: 'Chest', category: 'Compound', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '5', name: 'Chest Dips', bodyPart: 'Chest', category: 'Bodyweight', equipment: 'Parallel Bars', difficulty: 'Intermediate' },
  
  // Back
  { id: '6', name: 'Pull-ups', bodyPart: 'Back', category: 'Bodyweight', equipment: 'Pull-up Bar', difficulty: 'Intermediate' },
  { id: '7', name: 'Deadlifts', bodyPart: 'Back', category: 'Compound', equipment: 'Barbell', difficulty: 'Advanced' },
  { id: '8', name: 'Bent-over Rows', bodyPart: 'Back', category: 'Compound', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '9', name: 'Lat Pulldowns', bodyPart: 'Back', category: 'Isolation', equipment: 'Cable Machine', difficulty: 'Beginner' },
  { id: '10', name: 'T-Bar Rows', bodyPart: 'Back', category: 'Compound', equipment: 'T-Bar', difficulty: 'Intermediate' },
  
  // Legs
  { id: '11', name: 'Squats', bodyPart: 'Legs', category: 'Compound', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '12', name: 'Lunges', bodyPart: 'Legs', category: 'Compound', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { id: '13', name: 'Leg Press', bodyPart: 'Legs', category: 'Compound', equipment: 'Machine', difficulty: 'Beginner' },
  { id: '14', name: 'Romanian Deadlifts', bodyPart: 'Legs', category: 'Compound', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '15', name: 'Calf Raises', bodyPart: 'Legs', category: 'Isolation', equipment: 'Dumbbells', difficulty: 'Beginner' },
  
  // Shoulders
  { id: '16', name: 'Overhead Press', bodyPart: 'Shoulders', category: 'Compound', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '17', name: 'Lateral Raises', bodyPart: 'Shoulders', category: 'Isolation', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { id: '18', name: 'Rear Delt Flyes', bodyPart: 'Shoulders', category: 'Isolation', equipment: 'Dumbbells', difficulty: 'Intermediate' },
  { id: '19', name: 'Pike Push-ups', bodyPart: 'Shoulders', category: 'Bodyweight', equipment: 'None', difficulty: 'Intermediate' },
  { id: '20', name: 'Arnold Press', bodyPart: 'Shoulders', category: 'Isolation', equipment: 'Dumbbells', difficulty: 'Advanced' },
  
  // Arms
  { id: '21', name: 'Bicep Curls', bodyPart: 'Arms', category: 'Isolation', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { id: '22', name: 'Tricep Dips', bodyPart: 'Arms', category: 'Bodyweight', equipment: 'Bench', difficulty: 'Intermediate' },
  { id: '23', name: 'Hammer Curls', bodyPart: 'Arms', category: 'Isolation', equipment: 'Dumbbells', difficulty: 'Beginner' },
  { id: '24', name: 'Close-Grip Bench Press', bodyPart: 'Arms', category: 'Compound', equipment: 'Barbell', difficulty: 'Intermediate' },
  { id: '25', name: 'Preacher Curls', bodyPart: 'Arms', category: 'Isolation', equipment: 'EZ Bar', difficulty: 'Intermediate' },
  
  // Core
  { id: '26', name: 'Planks', bodyPart: 'Core', category: 'Isometric', equipment: 'None', difficulty: 'Beginner' },
  { id: '27', name: 'Russian Twists', bodyPart: 'Core', category: 'Dynamic', equipment: 'None', difficulty: 'Beginner' },
  { id: '28', name: 'Dead Bug', bodyPart: 'Core', category: 'Dynamic', equipment: 'None', difficulty: 'Beginner' },
  { id: '29', name: 'Mountain Climbers', bodyPart: 'Core', category: 'Dynamic', equipment: 'None', difficulty: 'Intermediate' },
  { id: '30', name: 'Hanging Leg Raises', bodyPart: 'Core', category: 'Dynamic', equipment: 'Pull-up Bar', difficulty: 'Advanced' },
  
  // Cardio
  { id: '31', name: 'Running', bodyPart: 'Cardio', category: 'Endurance', equipment: 'None', difficulty: 'Beginner' },
  { id: '32', name: 'Cycling', bodyPart: 'Cardio', category: 'Endurance', equipment: 'Bike', difficulty: 'Beginner' },
  { id: '33', name: 'Burpees', bodyPart: 'Cardio', category: 'HIIT', equipment: 'None', difficulty: 'Advanced' },
  { id: '34', name: 'Jump Rope', bodyPart: 'Cardio', category: 'HIIT', equipment: 'Jump Rope', difficulty: 'Intermediate' },
  { id: '35', name: 'Rowing', bodyPart: 'Cardio', category: 'Endurance', equipment: 'Rowing Machine', difficulty: 'Intermediate' },
];

const bodyParts = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

export function ExerciseLibrary({ onSelectExercise, onClose }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("All");

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = selectedBodyPart === 'All' || exercise.bodyPart === selectedBodyPart;
    return matchesSearch && matchesBodyPart;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/20 text-success';
      case 'Intermediate': return 'bg-warning/20 text-warning';
      case 'Advanced': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Dumbbell className="w-5 h-5 mr-2 text-primary" />
            Exercise Library
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
          <TabsList className="grid grid-cols-4 w-full h-auto p-1">
            {bodyParts.slice(0, 4).map((bodyPart) => (
              <TabsTrigger key={bodyPart} value={bodyPart} className="text-xs">
                {bodyPart}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid grid-cols-4 w-full h-auto p-1 mt-2">
            {bodyParts.slice(4).map((bodyPart) => (
              <TabsTrigger key={bodyPart} value={bodyPart} className="text-xs">
                {bodyPart}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
              onClick={() => onSelectExercise(exercise)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{exercise.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {exercise.category}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exercise.equipment}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No exercises found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}