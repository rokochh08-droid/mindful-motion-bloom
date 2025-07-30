import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Heart, Star, Zap } from "lucide-react";

interface MotivationalQuote {
  text: string;
  author: string;
  category: 'fitness' | 'mindset' | 'success' | 'wellness';
}

const motivationalQuotes: MotivationalQuote[] = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown", category: 'fitness' },
  { text: "Your body can do it. It's your mind you have to convince.", author: "Unknown", category: 'mindset' },
  { text: "Success is what comes after you stop making excuses.", author: "Luis Galarza", category: 'success' },
  { text: "Every workout is progress, no matter how small.", author: "Unknown", category: 'fitness' },
  { text: "Strong is the new beautiful.", author: "Unknown", category: 'mindset' },
  { text: "The groundwork for all happiness is good health.", author: "Leigh Hunt", category: 'wellness' },
  { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Khloe Kardashian", category: 'fitness' },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn", category: 'wellness' },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson", category: 'success' },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown", category: 'mindset' }
];

const achievements = [
  { title: "First Week Done!", description: "Completed your first week of workouts", icon: Star, unlocked: true },
  { title: "Consistency King", description: "5 workouts in a row", icon: Zap, unlocked: true },
  { title: "Early Bird", description: "3 morning workouts", icon: Sparkles, unlocked: false },
  { title: "Weekend Warrior", description: "Weekend workout completed", icon: Heart, unlocked: true },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'fitness': return 'bg-blue-100 text-blue-800';
    case 'mindset': return 'bg-purple-100 text-purple-800';
    case 'success': return 'bg-green-100 text-green-800';
    case 'wellness': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function MotivationalCard() {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote>(motivationalQuotes[0]);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    // Set a random quote on component mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  const getNewQuote = () => {
    let newQuote;
    do {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      newQuote = motivationalQuotes[randomIndex];
    } while (newQuote.text === currentQuote.text);
    
    setCurrentQuote(newQuote);
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  if (showAchievements) {
    return (
      <Card className="shadow-card bg-gradient-calm border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground flex items-center">
              <Star className="w-5 h-5 mr-2 text-accent" />
              Recent Achievements
            </h3>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowAchievements(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {unlockedAchievements.slice(0, 3).map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-card/50">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge className="bg-accent/20 text-accent border-0">
                    ✨ New
                  </Badge>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Keep going to unlock more achievements! 🏆
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card bg-gradient-calm border-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(currentQuote.category)}>
              {currentQuote.category}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={getNewQuote}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <blockquote className="text-sm text-foreground mb-2 italic leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        
        <p className="text-xs text-muted-foreground mb-4">
          — {currentQuote.author}
        </p>
        
        <div className="flex items-center justify-between">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setShowAchievements(true)}
            className="text-xs text-primary hover:text-primary-dark"
          >
            <Star className="w-3 h-3 mr-1" />
            View Achievements ({unlockedAchievements.length})
          </Button>
          
          <Button 
            size="sm"
            onClick={getNewQuote}
            className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            New Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}