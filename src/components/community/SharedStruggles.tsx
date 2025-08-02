import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, MessageCircle } from "lucide-react";

interface SupportPost {
  id: string;
  content: string;
  timeAgo: string;
  supportCount: number;
  commentCount: number;
  isAnonymous: boolean;
  struggle: string;
}

interface SharedStrugglesProps {
  posts: SupportPost[];
  onShowSupport: (postId: string) => void;
}

export function SharedStruggles({ posts, onShowSupport }: SharedStrugglesProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-foreground">You're Not Alone</h3>
        <p className="text-sm text-muted-foreground">Others are working through similar challenges</p>
      </div>
      
      {posts.map((post) => (
        <Card key={post.id} className="shadow-soft hover:shadow-card transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary/70" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  {post.isAnonymous ? "Someone" : "A community member"} is working through {post.struggle}
                </p>
                <p className="text-foreground text-sm leading-relaxed mb-3">
                  "{post.content}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {post.commentCount} gentle responses
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onShowSupport(post.id)}
                      className="text-xs h-7 text-primary hover:bg-primary/5"
                    >
                      <Heart className="w-3 h-3 mr-1" />
                      Send support ({post.supportCount})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}