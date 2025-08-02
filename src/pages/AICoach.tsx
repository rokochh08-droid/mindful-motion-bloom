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
import { supabase } from "@/integrations/supabase/client";

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
  const [isTyping, setIsTyping] = useState(false);
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
    "Feeling tired today 😴",
    "Need motivation 💪",
    "How's my progress? 📈",
    "Form check 🎯"
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
    setIsTyping(true);

    // Simulate AI response with typing delay
    setTimeout(async () => {
      const coachResponse = await generateCoachResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'coach',
        content: coachResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const findBestTrainingResponse = async (userInput: string): Promise<string | null> => {
    // First check localStorage for CSV imported data
    const localTrainingData: TrainingData[] = JSON.parse(localStorage.getItem('aiCoachTrainingData') || '[]');
    
    // Then fetch from Supabase database for Google Sheets imported data
    const { data: dbTrainingData, error } = await supabase
      .from('ai_training_data')
      .select('*');
    
    if (error) {
      console.error('Error fetching training data:', error);
    }
    
    console.log('Local training data count:', localTrainingData.length);
    console.log('Database training data count:', dbTrainingData?.length || 0);
    
    // Combine both sources
    const allTrainingData = [
      ...localTrainingData,
      ...(dbTrainingData || []).map(item => ({
        category: item.category,
        userMessage: item.user_message,
        aiResponse: item.ai_response,
        context: item.context || '',
        quality: item.quality
      }))
    ];
    
    console.log('Total training data count:', allTrainingData.length);
    
    if (allTrainingData.length === 0) return null;
    
    const input = userInput.toLowerCase();
    
    // Find the best matching training response
    let bestMatch: TrainingData | null = null;
    let bestScore = 0;
    
    for (const item of allTrainingData) {
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
    if (bestScore > 3 && bestMatch) {
      console.log('Best match score:', bestScore);
      console.log('Best match user message:', bestMatch.userMessage);
      console.log('Best match AI response:', bestMatch.aiResponse);
      console.log('Best match context:', bestMatch.context);
      console.log('AI response length:', bestMatch.aiResponse.length);
      return bestMatch.aiResponse; // Return just the AI response, not combined with context
    }
    return null;
  };

  const generateCoachResponse = async (userInput: string): Promise<string> => {
    // First, try to find a matching response from training data
    const trainingResponse = await findBestTrainingResponse(userInput);
    if (trainingResponse) {
      return trainingResponse;
    }
    
    // Try AI coach API first
    try {
      const userContext = `Recent streak: ${JSON.parse(localStorage.getItem('streakData') || '{}').currentStreak || 0} days. User goals: ${JSON.parse(localStorage.getItem('userGoals') || '[]').map((g: any) => g.title).join(', ')}`;
      
      const response = await supabase.functions.invoke('ai-coach', {
        body: { 
          message: userInput,
          userContext: userContext
        }
      });

      if (response.data && response.data.response) {
        return response.data.response;
      }
    } catch (error) {
      console.log('AI Coach API unavailable, falling back to default responses:', error);
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
    setTimeout(() => sendMessage(), 100);
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
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm shadow-soft'
                    : 'bg-muted/50 text-foreground rounded-2xl rounded-bl-sm shadow-soft border'
                } px-4 py-3 animate-fade-in`}>
                  {message.type === 'coach' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Brain className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span className="text-xs font-medium text-primary">Coach</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted/50 text-foreground rounded-2xl rounded-bl-sm shadow-soft border px-4 py-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Brain className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-medium text-primary">Coach</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Questions - Simplified & Subtle */}
        <div className="px-4 pb-2">
          <ScrollArea>
            <div className="flex space-x-2 max-w-2xl mx-auto">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => sendQuickQuestion(question)}
                  className="whitespace-nowrap text-xs bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground border-0 rounded-full h-8 px-3 transition-all hover:scale-105"
                >
                  {question}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border">
          <div className="max-w-2xl mx-auto">
            <div className="flex space-x-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Message your coach..."
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  className="w-full min-h-[72px] max-h-32 resize-none rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                  rows={3}
                />
              </div>
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-200 h-12 w-12 rounded-full p-0 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}