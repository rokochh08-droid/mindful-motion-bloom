import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  TrendingUp, 
  Zap, 
  Target,
  Clock,
  ChevronRight
} from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  category: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
  icon: React.ReactNode;
  color: string;
}

interface WorkoutTemplatesProps {
  onSelectTemplate: (exercises: Exercise[]) => void;
  onClose: () => void;
}

const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'push',
    name: 'Push Day',
    description: 'Target chest, shoulders, and triceps',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    icon: <Dumbbell className="w-6 h-6" />,
    color: 'bg-red-500',
    exercises: [
      {
        id: 'push-1',
        name: 'Push-ups',
        bodyPart: 'Chest',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      },
      {
        id: 'push-2', 
        name: 'Dumbbell Bench Press',
        bodyPart: 'Chest',
        category: 'Strength',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate'
      },
      {
        id: 'push-3',
        name: 'Shoulder Press',
        bodyPart: 'Shoulders',
        category: 'Strength', 
        equipment: 'Dumbbells',
        difficulty: 'Intermediate'
      },
      {
        id: 'push-4',
        name: 'Tricep Dips',
        bodyPart: 'Arms',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'pull',
    name: 'Pull Day',
    description: 'Focus on back and biceps',
    duration: '45-60 min',
    difficulty: 'Intermediate',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-blue-500',
    exercises: [
      {
        id: 'pull-1',
        name: 'Pull-ups',
        bodyPart: 'Back',
        category: 'Strength',
        equipment: 'Pull-up Bar',
        difficulty: 'Advanced'
      },
      {
        id: 'pull-2',
        name: 'Bent Over Rows',
        bodyPart: 'Back',
        category: 'Strength',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate'
      },
      {
        id: 'pull-3',
        name: 'Bicep Curls',
        bodyPart: 'Arms',
        category: 'Strength',
        equipment: 'Dumbbells',
        difficulty: 'Beginner'
      },
      {
        id: 'pull-4',
        name: 'Face Pulls',
        bodyPart: 'Back',
        category: 'Strength',
        equipment: 'Resistance Band',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'legs',
    name: 'Leg Day',
    description: 'Complete lower body workout',
    duration: '50-70 min',
    difficulty: 'Intermediate',
    icon: <Zap className="w-6 h-6" />,
    color: 'bg-green-500',
    exercises: [
      {
        id: 'legs-1',
        name: 'Squats',
        bodyPart: 'Legs',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      },
      {
        id: 'legs-2',
        name: 'Lunges',
        bodyPart: 'Legs',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Intermediate'
      },
      {
        id: 'legs-3',
        name: 'Deadlifts',
        bodyPart: 'Legs',
        category: 'Strength',
        equipment: 'Dumbbells',
        difficulty: 'Advanced'
      },
      {
        id: 'legs-4',
        name: 'Calf Raises',
        bodyPart: 'Legs',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'upper',
    name: 'Upper Body',
    description: 'Complete upper body strength training',
    duration: '40-55 min',
    difficulty: 'Intermediate',
    icon: <Target className="w-6 h-6" />,
    color: 'bg-purple-500',
    exercises: [
      {
        id: 'upper-1',
        name: 'Push-ups',
        bodyPart: 'Chest',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      },
      {
        id: 'upper-2',
        name: 'Pull-ups',
        bodyPart: 'Back',
        category: 'Strength',
        equipment: 'Pull-up Bar',
        difficulty: 'Advanced'
      },
      {
        id: 'upper-3',
        name: 'Shoulder Press',
        bodyPart: 'Shoulders',
        category: 'Strength',
        equipment: 'Dumbbells',
        difficulty: 'Intermediate'
      },
      {
        id: 'upper-4',
        name: 'Plank',
        bodyPart: 'Core',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'lower',
    name: 'Lower Body',
    description: 'Targeted lower body and core',
    duration: '35-50 min',
    difficulty: 'Beginner',
    icon: <Clock className="w-6 h-6" />,
    color: 'bg-orange-500',
    exercises: [
      {
        id: 'lower-1',
        name: 'Squats',
        bodyPart: 'Legs',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      },
      {
        id: 'lower-2',
        name: 'Glute Bridges',
        bodyPart: 'Glutes',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      },
      {
        id: 'lower-3',
        name: 'Wall Sit',
        bodyPart: 'Legs',
        category: 'Strength',
        equipment: 'Body Weight',
        difficulty: 'Beginner'
      },
      {
        id: 'lower-4',
        name: 'Mountain Climbers',
        bodyPart: 'Core',
        category: 'Cardio',
        equipment: 'Body Weight',
        difficulty: 'Intermediate'
      }
    ]
  }
];

export function WorkoutTemplates({ onSelectTemplate, onClose }: WorkoutTemplatesProps) {
  const handleSelectTemplate = (template: WorkoutTemplate) => {
    const exercisesWithSets = template.exercises.map(exercise => ({
      ...exercise,
      sets: [{ reps: 0, weight: 0, completed: false }]
    }));
    onSelectTemplate(exercisesWithSets);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Workout Templates</h2>
        <p className="text-muted-foreground mt-1">Choose a pre-built workout to get started quickly</p>
      </div>

      <div className="grid gap-4">
        {workoutTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className={`${template.color} p-3 rounded-lg text-white`}>
                  {template.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {template.duration}
                    </span>
                    <span className="flex items-center">
                      <Dumbbell className="w-3 h-3 mr-1" />
                      {template.exercises.length} exercises
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSelectTemplate(template)}
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  Start
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
          Cancel
        </Button>
      </div>
    </div>
  );
}