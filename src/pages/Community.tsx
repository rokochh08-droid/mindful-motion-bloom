import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SharedStruggles } from "@/components/community/SharedStruggles";
import { AnonymousCheckIn } from "@/components/community/AnonymousCheckIn";
import { MoodBasedMatching } from "@/components/community/MoodBasedMatching";
import { GentleCelebration } from "@/components/community/GentleCelebration";

interface SupportPost {
  id: string;
  content: string;
  timeAgo: string;
  supportCount: number;
  commentCount: number;
  isAnonymous: boolean;
  struggle: string;
}

interface MoodMatch {
  id: string;
  count: number;
  mood: string;
  energy: string;
  location: string;
  message: string;
  timeframe: string;
}

interface CelebrationPrompt {
  id: string;
  name: string;
  achievement: string;
  needsEncouragement: boolean;
  timeframe: string;
  suggestedMessage: string;
}

const mockSupportPosts: SupportPost[] = [
  {
    id: "1",
    content: "Monday mornings are so hard for me. I know I should work out but I just feel stuck.",
    timeAgo: "2h ago",
    supportCount: 12,
    commentCount: 8,
    isAnonymous: true,
    struggle: "Monday motivation"
  },
  {
    id: "2",
    content: "Started strong this week but already missing days. Feeling like I'm letting myself down again.",
    timeAgo: "4h ago", 
    supportCount: 18,
    commentCount: 15,
    isAnonymous: false,
    struggle: "consistency challenges"
  },
  {
    id: "3",
    content: "Comparing myself to others on social media. Know I shouldn't but can't help it.",
    timeAgo: "6h ago",
    supportCount: 24,
    commentCount: 12,
    isAnonymous: true,
    struggle: "comparison and self-doubt"
  }
];

const mockMoodMatches: MoodMatch[] = [
  {
    id: "1",
    count: 3,
    mood: "managing",
    energy: "low",
    location: "your area",
    message: "3 others nearby are also feeling low energy today but managing through it",
    timeframe: "checked in this morning"
  },
  {
    id: "2", 
    count: 7,
    mood: "struggling",
    energy: "low",
    location: "within 10 miles",
    message: "7 people are working through Monday motivation struggles today",
    timeframe: "active now"
  }
];

const mockCelebrationPrompts: CelebrationPrompt[] = [
  {
    id: "1",
    name: "Sarah",
    achievement: "completed her first week of consistent workouts",
    needsEncouragement: false,
    timeframe: "just now",
    suggestedMessage: "Way to go on your first week! Every day you showed up counts. 🌟"
  },
  {
    id: "2",
    name: "Mike",
    achievement: "shared that he's been struggling with motivation",
    needsEncouragement: true,
    timeframe: "1h ago",
    suggestedMessage: "It takes courage to share when things are tough. You're not alone in this. 💙"
  },
  {
    id: "3",
    name: "Jenny",
    achievement: "tried a new workout type despite feeling nervous",
    needsEncouragement: false,
    timeframe: "3h ago",
    suggestedMessage: "Stepping outside your comfort zone is so brave. Hope you're proud of yourself! ✨"
  }
];

export default function Community() {
  const [selectedTab, setSelectedTab] = useState("support");
  const [newSupportPost, setNewSupportPost] = useState("");

  const handleCheckIn = (mood: string, energy: string) => {
    toast.success("Thanks for checking in! Your anonymous share helps others feel connected. 💙");
  };

  const handleShowSupport = (postId: string) => {
    toast.success("Your support message sent! They'll feel your warmth. 🤗");
  };

  const handleConnect = (matchId: string) => {
    toast.success("Support message sent to your mood match! 💫");
  };

  const handleSendEncouragement = (promptId: string, message?: string) => {
    toast.success("Your encouragement brightened someone's day! ✨");
  };

  const handleCreateSupportPost = () => {
    if (!newSupportPost.trim()) return;
    
    toast.success("Your story is shared. Others will feel less alone knowing they're not the only one. 💙");
    setNewSupportPost("");
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground">Your gentle accountability partners</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="support" className="flex items-center text-xs">
              <Heart className="w-3 h-3 mr-1" />
              Support
            </TabsTrigger>
            <TabsTrigger value="checkin" className="flex items-center text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              Check-in
            </TabsTrigger>
            <TabsTrigger value="connect" className="flex items-center text-xs">
              <Users className="w-3 h-3 mr-1" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="celebrate" className="flex items-center text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Celebrate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="support" className="space-y-6 mt-6">
            {/* Share Support Post */}
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Share what you're working through
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Others find comfort knowing they're not alone in their struggles
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-muted-foreground">
                        "I'm struggling with..." (anonymous)
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Your Challenge</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Your story helps others feel less alone. This will be shared anonymously.
                        </p>
                        <Textarea
                          placeholder="What are you working through right now? Be honest - others will find strength in your vulnerability..."
                          value={newSupportPost}
                          onChange={(e) => setNewSupportPost(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setNewSupportPost("")}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateSupportPost} disabled={!newSupportPost.trim()}>
                            <Heart className="w-4 h-4 mr-2" />
                            Share Anonymously
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <SharedStruggles 
              posts={mockSupportPosts} 
              onShowSupport={handleShowSupport}
            />
          </TabsContent>

          <TabsContent value="checkin" className="space-y-6 mt-6">
            <AnonymousCheckIn onCheckIn={handleCheckIn} />
            
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Community Heartbeat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Today's anonymous check-ins help everyone feel connected
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">23</div>
                  <div className="text-xs text-muted-foreground">Working through challenges</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">45</div>
                  <div className="text-xs text-muted-foreground">Managing today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">18</div>
                  <div className="text-xs text-muted-foreground">Feeling strong</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connect" className="space-y-6 mt-6">
            <MoodBasedMatching 
              matches={mockMoodMatches}
              onConnect={handleConnect}
            />
          </TabsContent>

          <TabsContent value="celebrate" className="space-y-6 mt-6">
            <GentleCelebration 
              prompts={mockCelebrationPrompts}
              onSendEncouragement={handleSendEncouragement}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}