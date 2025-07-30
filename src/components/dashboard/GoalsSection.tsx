import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, Trophy, CheckCircle, Circle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: 'workout' | 'steps' | 'water' | 'sleep' | 'meditation' | 'custom';
  createdAt: Date;
  completedDates: string[];
}

const goalCategories = {
  workout: { icon: Target, label: 'Workouts', unit: 'sessions' },
  steps: { icon: Target, label: 'Steps', unit: 'steps' },
  water: { icon: Target, label: 'Water', unit: 'glasses' },
  sleep: { icon: Target, label: 'Sleep', unit: 'hours' },
  meditation: { icon: Target, label: 'Meditation', unit: 'minutes' },
  custom: { icon: Target, label: 'Custom', unit: 'units' }
};

export function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    target: '',
    frequency: 'weekly' as const,
    category: 'workout' as const
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem('userGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Sample goals for demo
      const sampleGoals: Goal[] = [
        {
          id: '1',
          title: 'Weekly Workouts',
          description: 'Stay consistent with your fitness routine',
          target: 4,
          current: 2,
          frequency: 'weekly',
          category: 'workout',
          createdAt: new Date(),
          completedDates: []
        },
        {
          id: '2',
          title: 'Daily Steps',
          description: 'Keep moving throughout the day',
          target: 8000,
          current: 5200,
          frequency: 'daily',
          category: 'steps',
          createdAt: new Date(),
          completedDates: []
        }
      ];
      setGoals(sampleGoals);
      localStorage.setItem('userGoals', JSON.stringify(sampleGoals));
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      target: parseInt(newGoal.target),
      current: 0,
      frequency: newGoal.frequency,
      category: newGoal.category,
      createdAt: new Date(),
      completedDates: []
    };

    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    setNewGoal({ title: '', description: '', target: '', frequency: 'weekly', category: 'workout' });
    setIsAddingGoal(false);
    
    toast({
      title: "Goal created! 🎯",
      description: "You're one step closer to achieving your dreams!"
    });
  };

  const updateGoalProgress = (goalId: string, increment: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: Math.min(goal.current + increment, goal.target) }
        : goal
    );
    saveGoals(updatedGoals);

    const updatedGoal = updatedGoals.find(g => g.id === goalId);
    if (updatedGoal && updatedGoal.current >= updatedGoal.target) {
      toast({
        title: "Goal Completed! 🏆",
        description: `Amazing work on "${updatedGoal.title}"!`,
      });
    }
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
    toast({
      title: "Goal removed",
      description: "Goal has been deleted successfully"
    });
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getFrequencyBadgeColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Your Goals
          </CardTitle>
          <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary hover:shadow-glow">
                <Plus className="w-4 h-4 mr-1" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Goal title (e.g., 'Morning Runs')"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
                <Input
                  placeholder="Description (optional)"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Target"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  />
                  <Select value={newGoal.frequency} onValueChange={(value: any) => setNewGoal({...newGoal, frequency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={newGoal.category} onValueChange={(value: any) => setNewGoal({...newGoal, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(goalCategories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>{category.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsAddingGoal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddGoal} className="flex-1 bg-gradient-primary">
                    Create Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-3">No goals yet. Create your first goal!</p>
            <Button onClick={() => setIsAddingGoal(true)} size="sm" className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-1" />
              Add Your First Goal
            </Button>
          </div>
        ) : (
          goals.map((goal) => {
            const CategoryIcon = goalCategories[goal.category].icon;
            const progress = getProgressPercentage(goal);
            const isCompleted = goal.current >= goal.target;
            
            return (
              <div key={goal.id} className="border border-border rounded-lg p-4 transition-smooth hover:shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="w-4 h-4 text-primary" />
                    <h3 className="font-medium text-foreground">{goal.title}</h3>
                    {isCompleted && <Trophy className="w-4 h-4 text-accent" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getFrequencyBadgeColor(goal.frequency)}>
                      {goal.frequency}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteGoal(goal.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">
                      {goal.current}/{goal.target} {goalCategories[goal.category].unit}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {!isCompleted && (
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateGoalProgress(goal.id, 1)}
                      className="flex-1 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      +1
                    </Button>
                    {goal.target > 10 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, 5)}
                        className="flex-1 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        +5
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}