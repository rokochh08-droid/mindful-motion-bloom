import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp,
  Users,
  Search,
  Filter,
  Trophy,
  Target,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timeAgo: string;
  category: string;
  tags: string[];
}

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "Sarah M.",
    avatar: "SM",
    content: "Just crushed my first 100 push-ups in a single session! Started with barely being able to do 10. The journey has been incredible. For anyone struggling - consistency beats perfection every time! 💪",
    likes: 47,
    comments: 12,
    timeAgo: "2h ago",
    category: "Achievement",
    tags: ["push-ups", "milestone", "motivation"]
  },
  {
    id: "2", 
    author: "Mike Chen",
    avatar: "MC",
    content: "Looking for a workout buddy in downtown Seattle! I usually hit the gym around 6 AM. Anyone interested in some accountability partnership?",
    likes: 23,
    comments: 8,
    timeAgo: "4h ago",
    category: "Buddy Request",
    tags: ["seattle", "accountability", "morning-workout"]
  },
  {
    id: "3",
    author: "Jessica R.",
    avatar: "JR", 
    content: "Day 30 of my transformation journey! Progress pics in comments. Still have a long way to go but celebrating every small win. This community keeps me motivated! 🙏",
    likes: 89,
    comments: 24,
    timeAgo: "6h ago",
    category: "Progress",
    tags: ["transformation", "30-day-challenge", "progress"]
  }
];

const communities: Community[] = [
  {
    id: "1",
    name: "Beginner Friendly",
    description: "Perfect place to start your fitness journey",
    members: 2847,
    category: "Support",
    icon: <Target className="w-5 h-5" />,
    color: "bg-blue-500"
  },
  {
    id: "2",
    name: "Weight Loss Warriors", 
    description: "Supporting each other through weight loss goals",
    members: 1923,
    category: "Goals",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-green-500"
  },
  {
    id: "3",
    name: "Strength Training",
    description: "Building muscle and getting stronger together",
    members: 3654,
    category: "Training",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-orange-500"
  },
  {
    id: "4",
    name: "Daily Motivation",
    description: "Daily doses of inspiration and encouragement",
    members: 5721,
    category: "Motivation", 
    icon: <Trophy className="w-5 h-5" />,
    color: "bg-purple-500"
  }
];

export default function Community() {
  const [selectedTab, setSelectedTab] = useState("feed");
  const [newPost, setNewPost] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    toast.success("Post shared with the community! 🎉");
    setNewPost("");
  };

  const filteredPosts = mockPosts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground">Connect, share, and grow together</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Communities
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6 mt-6">
            {/* Create Post */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      You
                    </AvatarFallback>
                  </Avatar>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-muted-foreground">
                        Share your fitness journey...
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="What's on your mind? Share your progress, ask for advice, or motivate others..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="anonymous"
                              checked={isAnonymous}
                              onChange={(e) => setIsAnonymous(e.target.checked)}
                              className="rounded"
                            />
                            <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                              Post anonymously
                            </label>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setNewPost("")}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                              <Plus className="w-4 h-4 mr-2" />
                              Share Post
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>

            {/* Search and Filter */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search posts, people, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    {/* Post Header */}
                    <div className="flex items-start space-x-3 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">{post.author}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center space-x-6 pt-3 border-t">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="space-y-6 mt-6">
            <div className="grid gap-4">
              {communities.map((community) => (
                <Card key={community.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className={`${community.color} p-3 rounded-lg text-white`}>
                        {community.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{community.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {community.members.toLocaleString()} members
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {community.category}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6 mt-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Trending Topics</h3>
              <p className="text-muted-foreground">See what's popular in the fitness community</p>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                {["#30DayChallenge", "#MorningWorkout", "#HealthyRecipes", "#FitnessMotivation"].map((tag) => (
                  <Badge key={tag} variant="outline" className="py-2 px-3 justify-center">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}