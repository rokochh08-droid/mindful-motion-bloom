import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className={cn(showNav ? "pb-20" : "pb-4")}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}