import { Home, Activity, Brain, TrendingUp, User, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home", comingSoon: false },
  { path: "/workout", icon: Activity, label: "Workout", comingSoon: false },
  { path: "/coach", icon: Brain, label: "AI Coach", comingSoon: false },
  { path: "/progress", icon: TrendingUp, label: "Progress", comingSoon: false },
  { path: "/community", icon: Users, label: "Community", comingSoon: true },
  { path: "/profile", icon: User, label: "Profile", comingSoon: false },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-soft z-50">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map(({ path, icon: Icon, label, comingSoon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center p-2 min-w-0 flex-1 transition-smooth relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
                comingSoon && "opacity-60"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-smooth",
                  isActive && "animate-bounce-gentle"
                )} 
              />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-primary"
              )}>
                {label}
              </span>
              {comingSoon && (
                <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full font-medium shadow-soft">
                  Soon
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}