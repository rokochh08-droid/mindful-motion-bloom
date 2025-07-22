import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Brain, 
  Heart, 
  Edit,
  Save,
  Target,
  Calendar,
  Activity,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  joinDate: Date;
  goals: string;
  fitnessLevel: string;
  coachingStyle: string;
  bio: string;
}

interface AISettings {
  motivationalStyle: 'encouraging' | 'direct' | 'gentle';
  checkInFrequency: 'daily' | 'weekly' | 'monthly';
  focusArea: 'strength' | 'cardio' | 'flexibility' | 'mental-health';
  dataSharing: boolean;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    joinDate: new Date(),
    goals: '',
    fitnessLevel: '',
    coachingStyle: '',
    bio: ''
  });

  const [aiSettings, setAiSettings] = useState<AISettings>({
    motivationalStyle: 'encouraging',
    checkInFrequency: 'daily',
    focusArea: 'mental-health',
    dataSharing: true
  });

  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    communityActivity: true,
    aiInsights: true,
    achievements: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    workoutsVisible: false,
    progressVisible: false,
    communityPosts: true
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        joinDate: new Date(parsed.joinDate)
      });
    } else {
      // Set demo data
      setProfile({
        name: 'Alex Johnson',
        email: 'alex@example.com',
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        goals: 'Build strength and muscle',
        fitnessLevel: 'Intermediate (1-2 years)',
        coachingStyle: 'encouraging',
        bio: 'On a journey to become the strongest version of myself, mentally and physically. Love connecting with others who understand the struggle and celebrate small wins!'
      });
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast.success('Profile updated successfully! 🎉');
  };

  const updateAISetting = <K extends keyof AISettings>(key: K, value: AISettings[K]) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
    toast.success('AI coaching preferences updated!');
  };

  const getJoinDuration = () => {
    const days = Math.floor((new Date().getTime() - profile.joinDate.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 30) return `${days} days`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Your fitness journey settings</p>
        </div>

        {/* Profile Header */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {getJoinDuration()} ago
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            {profile.bio && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="shadow-soft text-center">
            <CardContent className="p-3">
              <Activity className="w-5 h-5 mx-auto mb-1 text-success" />
              <div className="text-lg font-bold text-foreground">23</div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft text-center">
            <CardContent className="p-3">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-lg font-bold text-foreground">8.2</div>
              <div className="text-xs text-muted-foreground">Avg Mood</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft text-center">
            <CardContent className="p-3">
              <Target className="w-5 h-5 mx-auto mb-1 text-accent" />
              <div className="text-lg font-bold text-foreground">15</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft text-center">
            <CardContent className="p-3">
              <Heart className="w-5 h-5 mx-auto mb-1 text-destructive" />
              <div className="text-lg font-bold text-foreground">94%</div>
              <div className="text-xs text-muted-foreground">Feel Better</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ai">AI Coach</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="goals">Primary Goals</Label>
                  <Input
                    id="goals"
                    value={profile.goals}
                    onChange={(e) => setProfile(prev => ({ ...prev, goals: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="e.g., Build strength, Improve cardio..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="fitnessLevel">Fitness Level</Label>
                  <Input
                    id="fitnessLevel"
                    value={profile.fitnessLevel}
                    onChange={(e) => setProfile(prev => ({ ...prev, fitnessLevel: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Tell the community about your fitness journey..."
                    rows={3}
                  />
                </div>

                {isEditing && (
                  <Button onClick={saveProfile} className="w-full bg-gradient-success hover:shadow-glow transition-smooth">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-primary" />
                  AI Coaching Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Motivational Style</Label>
                  <p className="text-sm text-muted-foreground mb-3">How should your AI coach communicate with you?</p>
                  <div className="grid gap-3">
                    {[
                      { value: 'encouraging', label: 'Encouraging', desc: 'Positive, supportive, celebrates small wins' },
                      { value: 'direct', label: 'Direct', desc: 'Straightforward, goal-focused, efficient' },
                      { value: 'gentle', label: 'Gentle', desc: 'Soft, understanding, focuses on self-compassion' }
                    ].map((style) => (
                      <div 
                        key={style.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-smooth ${
                          aiSettings.motivationalStyle === style.value 
                            ? 'border-primary bg-primary-light' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateAISetting('motivationalStyle', style.value as any)}
                      >
                        <div className="font-medium text-foreground">{style.label}</div>
                        <div className="text-sm text-muted-foreground">{style.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Check-in Frequency</Label>
                  <p className="text-sm text-muted-foreground mb-3">How often should your coach check in with you?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' }
                    ].map((freq) => (
                      <Button
                        key={freq.value}
                        variant={aiSettings.checkInFrequency === freq.value ? "default" : "outline"}
                        onClick={() => updateAISetting('checkInFrequency', freq.value as any)}
                        className="w-full"
                      >
                        {freq.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Focus Area</Label>
                  <p className="text-sm text-muted-foreground mb-3">What aspect should your coach prioritize?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'strength', label: 'Strength Training' },
                      { value: 'cardio', label: 'Cardiovascular Health' },
                      { value: 'flexibility', label: 'Flexibility & Mobility' },
                      { value: 'mental-health', label: 'Mental Health' }
                    ].map((area) => (
                      <Button
                        key={area.value}
                        variant={aiSettings.focusArea === area.value ? "default" : "outline"}
                        onClick={() => updateAISetting('focusArea', area.value as any)}
                        className="w-full text-sm"
                      >
                        {area.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-primary" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'workoutReminders', label: 'Workout Reminders', desc: 'Get reminded about planned workouts' },
                  { key: 'communityActivity', label: 'Community Activity', desc: 'New posts, comments, and likes' },
                  { key: 'aiInsights', label: 'AI Insights', desc: 'Personalized coaching tips and patterns' },
                  { key: 'achievements', label: 'Achievements', desc: 'Celebrate milestones and badges earned' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{setting.label}</div>
                      <div className="text-sm text-muted-foreground">{setting.desc}</div>
                    </div>
                    <Switch
                      checked={notifications[setting.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [setting.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Privacy Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'profileVisible', label: 'Profile Visibility', desc: 'Others can see your profile and bio' },
                  { key: 'workoutsVisible', label: 'Workout Data', desc: 'Share workout stats with community' },
                  { key: 'progressVisible', label: 'Progress Charts', desc: 'Show your progress in community' },
                  { key: 'communityPosts', label: 'Community Posts', desc: 'Allow others to see your posts and comments' }
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{setting.label}</div>
                      <div className="text-sm text-muted-foreground">{setting.desc}</div>
                    </div>
                    <Switch
                      checked={privacy[setting.key as keyof typeof privacy]}
                      onCheckedChange={(checked) => 
                        setPrivacy(prev => ({ ...prev, [setting.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-soft bg-gradient-calm border-0">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Data Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Your workout data and personal information are encrypted and never shared 
                      with third parties without your explicit consent. You maintain full control 
                      over your privacy settings at all times.
                    </p>
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