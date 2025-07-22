import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus,
  Sparkles,
  TrendingUp,
  Shield,
  ThumbsUp,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isSupport: boolean;
  tags: string[];
  hasLiked?: boolean;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined?: boolean;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'FitnessJourney23',
      avatar: 'FJ',
      content: "Had a really tough day at work and almost skipped my workout. But I pushed through and did a 20-minute walk instead of my planned run. Sometimes just showing up is enough! 💪",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      comments: 4,
      isSupport: false,
      tags: ['motivation', 'walking'],
      hasLiked: false
    },
    {
      id: '2',
      author: 'StrengthSeeker',
      avatar: 'SS',
      content: "Looking for others who struggle with body image issues. The gym can be intimidating, but I'm learning to focus on how strong I feel rather than how I look. Anyone else on this journey?",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 8,
      comments: 7,
      isSupport: true,
      tags: ['body-image', 'strength', 'support'],
      hasLiked: true
    },
    {
      id: '3',
      author: 'MindfulMover',
      avatar: 'MM',
      content: "Celebrating 30 days of consistent movement! Not every day was perfect, but I moved my body in some way each day. Yoga, walks, dancing in my kitchen - it all counts! 🎉",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 24,
      comments: 9,
      isSupport: false,
      tags: ['milestone', 'consistency'],
      hasLiked: false
    }
  ]);

  const [supportGroups] = useState<SupportGroup[]>([
    {
      id: '1',
      name: 'Body Positive Fitness',
      description: 'Focus on health and strength, not appearance',
      members: 156,
      category: 'Mental Health',
      isJoined: true
    },
    {
      id: '2',
      name: 'Anxiety & Exercise',
      description: 'Supporting each other through fitness anxiety',
      members: 89,
      category: 'Mental Health',
      isJoined: false
    },
    {
      id: '3',
      name: 'Beginner Friendly',
      description: 'Safe space for fitness beginners',
      members: 234,
      category: 'Beginner Support',
      isJoined: true
    },
    {
      id: '4',
      name: 'Parent Fitness',
      description: 'Fitness tips and support for busy parents',
      members: 178,
      category: 'Lifestyle',
      isJoined: false
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [isSupport, setIsSupport] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked 
          }
        : post
    ));
  };

  const submitPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'YU',
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isSupport,
      tags: [],
      hasLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setIsSupport(false);
    toast.success("Your post has been shared! 🎉");
  };

  const joinGroup = (groupId: string) => {
    toast.success("Joined group successfully! Welcome to the community 👋");
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground">Connect with supportive fitness friends</p>
        </div>

        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="groups">Support Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            {/* Share Post */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-primary" />
                  Share with the community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your journey, ask for support, or celebrate a win..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isSupport ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsSupport(!isSupport)}
                      className={isSupport ? "bg-accent hover:bg-accent/90" : ""}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Need Support
                    </Button>
                    {isSupport && (
                      <Badge variant="secondary" className="text-xs">
                        Anonymous & Safe
                      </Badge>
                    )}
                  </div>
                  
                  <Button 
                    onClick={submitPost}
                    disabled={!newPost.trim()}
                    className="bg-gradient-primary hover:shadow-glow transition-smooth"
                  >
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="shadow-soft bg-gradient-calm border-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Community Guidelines</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a safe, supportive space. We focus on effort over results, 
                      encourage progress of all sizes, and practice kindness always.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className={`shadow-card ${post.isSupport ? 'border-l-4 border-l-accent' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-foreground">{post.author}</span>
                          {post.isSupport && (
                            <Badge variant="secondary" className="text-xs bg-accent-light text-accent">
                              <Shield className="w-3 h-3 mr-1" />
                              Support
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground leading-relaxed mb-3">
                          {post.content}
                        </p>
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`p-1 h-auto ${post.hasLiked ? 'text-accent' : 'text-muted-foreground'}`}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${post.hasLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          
                          <Button variant="ghost" size="sm" className="p-1 h-auto text-muted-foreground">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            {/* My Groups */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-success" />
                  My Support Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {supportGroups.filter(group => group.isJoined).map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-3 bg-success-light rounded-lg">
                      <div>
                        <h3 className="font-medium text-success-foreground">{group.name}</h3>
                        <p className="text-sm text-success-foreground/80">{group.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-success-foreground/60">
                            {group.members} members
                          </span>
                          <Badge variant="outline" className="text-xs border-success-foreground/20">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-success-foreground hover:bg-success-foreground/10">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discover Groups */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Discover Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {supportGroups.filter(group => !group.isJoined).map((group) => (
                    <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-foreground">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {group.members} members
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {group.category}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => joinGroup(group.id)}
                        className="bg-gradient-primary hover:shadow-glow transition-smooth"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gradient-calm rounded-lg">
                    <div className="text-lg font-bold text-foreground">1.2k</div>
                    <div className="text-xs text-muted-foreground">Support Messages</div>
                  </div>
                  <div className="p-3 bg-gradient-calm rounded-lg">
                    <div className="text-lg font-bold text-foreground">89%</div>
                    <div className="text-xs text-muted-foreground">Feel Supported</div>
                  </div>
                  <div className="p-3 bg-gradient-calm rounded-lg">
                    <div className="text-lg font-bold text-foreground">567</div>
                    <div className="text-xs text-muted-foreground">Active Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}