-- Create workouts table for storing completed workouts
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  exercises JSONB NOT NULL,
  mood_before INTEGER NOT NULL CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER NOT NULL CHECK (mood_after >= 1 AND mood_after <= 10),
  energy_before INTEGER NOT NULL CHECK (energy_before >= 1 AND energy_before <= 10),
  energy_after INTEGER NOT NULL CHECK (energy_after >= 1 AND energy_after <= 10),
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 10),
  duration INTEGER NOT NULL,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own workouts" 
ON public.workouts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workouts" 
ON public.workouts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
ON public.workouts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
ON public.workouts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_workouts_updated_at
BEFORE UPDATE ON public.workouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();