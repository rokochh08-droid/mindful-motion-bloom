import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layout } from "@/components/layout/Layout";
import { CSVImport } from "@/components/ai-coach/CSVImport";
import { 
  Brain, 
  Send, 
  Sparkles, 
  Heart, 
  TrendingUp, 
  Target,
  MessageCircle,
  Lightbulb,
  Settings
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

interface Insight {
  title: string;
  description: string;
  icon: any;
  color: string;
}

interface TrainingData {
  category: string;
  userMessage: string;
  aiResponse: string;
  context: string;
  quality: number;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'coach',
      content: "Hey there! 👋 I'm your AI fitness coach. I've been analyzing your workout patterns and I'm really impressed with your consistency this week! How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const insights: Insight[] = [
    {
      title: "Monday Motivation",
      description: "You typically struggle on Mondays. Try scheduling easier workouts to build momentum.",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "Progress Pattern",
      description: "Your mood improves 85% more after strength training vs cardio. Consider more lifting!",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Recovery Insight",
      description: "You perform better with 1 rest day between intense sessions. Listen to your body!",
      icon: Heart,
      color: "text-accent"
    }
  ];

  const quickQuestions = [
    "How should I modify my workout if I'm feeling tired?",
    "I'm losing motivation, can you help?",
    "What exercises are best for my goals?",
    "How can I improve my form?",
    "I missed a few days, how do I get back on track?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const coachResponse = generateCoachResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: coachResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const findBestTrainingResponse = (userInput: string): string | null => {
    const trainingData: TrainingData[] = JSON.parse(localStorage.getItem('aiCoachTrainingData') || '[]');
    
    if (trainingData.length === 0) return null;
    
    const input = userInput.toLowerCase();
    
    // Find the best matching training response
    let bestMatch: TrainingData | null = null;
    let bestScore = 0;
    
    for (const item of trainingData) {
      const userMessage = item.userMessage.toLowerCase();
      const context = item.context.toLowerCase();
      
      // Simple keyword matching score
      let score = 0;
      const inputWords = input.split(' ').filter(word => word.length > 2);
      
      for (const word of inputWords) {
        if (userMessage.includes(word)) score += 3;
        if (context.includes(word)) score += 1;
      }
      
      // Boost score for quality
      score = score * (item.quality / 5);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }
    
    // Return training response if we found a good match (score > 3)
    return bestScore > 3 ? bestMatch?.aiResponse || null : null;
  };

  const generateCoachResponse = (userInput: string): string => {
    // First, try to find a matching response from training data
    const trainingResponse = findBestTrainingResponse(userInput);
    if (trainingResponse) {
      return trainingResponse;
    }
    
    // Fall back to default responses
    const input = userInput.toLowerCase();
    
    if (input.includes('tired') || input.includes('exhausted')) {
      return "I hear you! Being tired is your body's way of communicating. Consider a lighter workout today - maybe a gentle walk, some stretching, or even just rest. Remember, recovery is part of the journey, not a setback. What feels right for your body today?";
    }
    
    if (input.includes('motivation') || input.includes('motivated')) {
      return "Motivation fluctuates - that's totally normal! What I've noticed from your data is that you feel amazing after workouts, even when you don't want to start. How about we set a tiny goal today? Even 10 minutes counts. What's one small thing you could do right now?";
    }
    
    if (input.includes('missed') || input.includes('skipped')) {
      return "Hey, life happens! The fact that you're here talking to me shows you care about your health. You haven't lost your progress from missing a few days. Let's focus on today - what's one gentle way you could move your body that would feel good right now?";
    }
    
    if (input.includes('form') || input.includes('technique')) {
      return "Great question! Proper form is so much more important than heavy weights or high reps. Based on your logged exercises, I'd suggest focusing on controlled movements and really feeling the muscles work. Want me to break down the form for any specific exercise?";
    }
    
    return "That's a thoughtful question! Based on what I know about your fitness journey and goals, I'd suggest focusing on consistency over intensity. Your progress shows you're doing great - remember that fitness is a lifestyle, not a destination. What specific aspect would you like to dive deeper into?";
  };

  const sendQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Fitness Coach</h1>
                <p className="text-sm text-muted-foreground">Your supportive training companion</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          
          {showSettings && (
            <div className="mt-4 p-4 bg-card border rounded-lg">
              <CSVImport onDataImported={() => {
                // Optionally refresh insights or show success message
              }} />
            </div>
          )}
        </div>

        {/* Insights Cards */}
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium text-foreground flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-accent" />
            Insights from your data
          </div>
          <div className="grid gap-3">
            {insights.map((insight, index) => (
              <Card key={index} className="shadow-soft border-l-4 border-l-primary">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    <insight.icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className="font-medium text-sm text-foreground">{insight.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border shadow-soft'
                }`}>
                  {message.type === 'coach' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">AI Coach</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        <div className="p-4 border-t border-border">
          <div className="text-sm font-medium text-foreground mb-3 flex items-center">
            <MessageCircle className="w-4 h-4 mr-2 text-primary" />
            Quick questions
          </div>
          <ScrollArea>
            <div className="flex space-x-2 pb-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => sendQuickQuestion(question)}
                  className="whitespace-nowrap text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your coach anything..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="bg-gradient-primary hover:shadow-glow transition-smooth"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Your coach learns from your workouts to give personalized advice
          </p>
        </div>
      </div>
    </Layout>
  );
}