-- Create training data table for AI coach
CREATE TABLE public.ai_training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context TEXT,
  quality INTEGER NOT NULL DEFAULT 5 CHECK (quality >= 1 AND quality <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_training_data ENABLE ROW LEVEL SECURITY;

-- Create policy for reading training data (public access for AI responses)
CREATE POLICY "Anyone can read training data" 
ON public.ai_training_data 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_training_data_updated_at
BEFORE UPDATE ON public.ai_training_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample training data
INSERT INTO public.ai_training_data (category, user_message, ai_response, context, quality) VALUES
('motivation', 'I don''t feel like working out today', 'I understand that feeling! Sometimes our motivation dips, and that''s completely normal. Remember, you don''t have to feel motivated to take action. Even a 10-minute walk can shift your energy. What''s the smallest movement that feels doable right now?', 'Low motivation, workout reluctance', 5),
('fatigue', 'I''m too tired to exercise', 'Your body is telling you something important. Being tired doesn''t always mean you need to skip exercise entirely. Sometimes gentle movement like stretching or a slow walk can actually boost your energy. However, if you''re truly exhausted, rest is just as important as exercise. Listen to your body - what does it really need today?', 'Physical fatigue, energy management', 5),
('form', 'How do I know if my squat form is correct?', 'Great question! Proper squat form is crucial for safety and effectiveness. Key points: feet shoulder-width apart, weight in your heels, knees tracking over toes, chest up, and sitting back like you''re sitting in a chair. Start with bodyweight squats and focus on the movement pattern before adding weight. Consider recording yourself or working with a trainer for feedback.', 'Exercise technique, squats', 5);