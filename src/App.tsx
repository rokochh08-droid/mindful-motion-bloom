import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/onboarding/Welcome";
import Goals from "./pages/onboarding/Goals";
import WorkoutLog from "./pages/WorkoutLog";
import WorkoutSession from "./pages/WorkoutSession";
import WorkoutCelebration from "./pages/WorkoutCelebration";
import WorkoutHistory from "./pages/WorkoutHistory";
import AICoach from "./pages/AICoach";
import Progress from "./pages/Progress";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding/goals" element={<Goals />} />
           <Route path="/workout" element={<WorkoutLog />} />
           <Route path="/workout/session" element={<WorkoutSession />} />
           <Route path="/workout/celebration" element={<WorkoutCelebration />} />
           <Route path="/history" element={<WorkoutHistory />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
