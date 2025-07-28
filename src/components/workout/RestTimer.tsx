import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Play, X } from "lucide-react";

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRest: (seconds: number) => void;
}

export function RestTimer({ isOpen, onClose, onStartRest }: RestTimerProps) {
  const [customTime, setCustomTime] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing timer when component unmounts or closes
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isOpen]);

  const presetTimes = [
    { label: "30s", seconds: 30 },
    { label: "45s", seconds: 45 },
    { label: "60s", seconds: 60 },
    { label: "90s", seconds: 90 },
    { label: "2 min", seconds: 120 },
    { label: "3 min", seconds: 180 },
  ];

  const handlePresetSelect = (seconds: number) => {
    onStartRest(seconds);
    onClose();
  };

  const handleCustomRest = () => {
    const seconds = parseInt(customTime);
    if (seconds > 0) {
      onStartRest(seconds);
      onClose();
      setCustomTime("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-warm-600">
            <Clock className="w-5 h-5 mr-2" />
            Choose Rest Time
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Preset Times */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Select</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetTimes.map((preset) => (
                <Button
                  key={preset.seconds}
                  variant="outline"
                  onClick={() => handlePresetSelect(preset.seconds)}
                  className="bg-warm-50 hover:bg-warm-100 border-warm-200 text-warm-700 hover:text-warm-800 rounded-xl"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Custom Time */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Custom Time</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Enter seconds"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="rounded-xl border-warm-200 focus:border-warm-400"
                  min="1"
                />
              </div>
              <Button
                onClick={handleCustomRest}
                disabled={!customTime || parseInt(customTime) <= 0}
                className="bg-gradient-warm hover:shadow-glow rounded-xl"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          </div>
          
          {/* Skip Rest */}
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground hover:text-foreground rounded-xl"
          >
            Skip Rest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}