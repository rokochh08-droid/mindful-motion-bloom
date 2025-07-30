import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pause, Play } from "lucide-react";

interface MeditationRestTimerProps {
  initialSeconds: number;
  onComplete: () => void;
  onExit: () => void;
}

export function MeditationRestTimer({ initialSeconds, onComplete, onExit }: MeditationRestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [totalSeconds] = useState(initialSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds <= 1) {
            onComplete();
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - seconds) / totalSeconds) * 100 : 100;
  const circumference = 2 * Math.PI * 120; // radius of 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-background z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-warm-50/90 to-green-50/90" />
      
      <div className="relative z-10 text-center space-y-8 p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onExit}
          className="absolute top-4 left-4 text-warm-600 hover:text-warm-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Workout
        </Button>

        {/* Rest Timer Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-warm-800">Rest Time</h1>
          <p className="text-warm-600">Take a moment to recover</p>
        </div>

        {/* Circular Progress Timer */}
        <div className="relative flex items-center justify-center">
          <svg 
            className="w-80 h-80 transform -rotate-90" 
            viewBox="0 0 280 280"
          >
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-warm-200/30"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-1000 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Timer in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-light text-warm-800 mb-2">
              {formatTime(seconds)}
            </div>
            <div className="text-sm text-warm-600">
              {seconds > 0 ? 'remaining' : 'completed'}
            </div>
          </div>
        </div>

        {/* Pause/Resume Button */}
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant="outline"
          size="lg"
          className="bg-white/50 border-warm-300 text-warm-700 hover:bg-white/70 rounded-full px-8"
          disabled={seconds === 0}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Resume
            </>
          )}
        </Button>

        {/* Skip Rest */}
        <Button
          onClick={onComplete}
          variant="ghost"
          className="text-warm-600 hover:text-warm-800"
        >
          Skip Rest
        </Button>
      </div>
    </div>
  );
}