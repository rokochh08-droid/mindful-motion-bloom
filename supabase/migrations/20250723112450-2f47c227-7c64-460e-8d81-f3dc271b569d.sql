-- Add INSERT policy for ai_training_data table to allow Google Sheets import
CREATE POLICY "Anyone can insert training data" 
ON public.ai_training_data 
FOR INSERT 
WITH CHECK (true);