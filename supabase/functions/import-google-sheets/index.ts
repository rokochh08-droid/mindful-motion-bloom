import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrainingDataRow {
  category: string;
  user_message: string;
  ai_response: string;
  context?: string;
  quality?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sheetsUrl } = await req.json();
    
    if (!sheetsUrl) {
      throw new Error('Google Sheets URL is required');
    }

    // Extract sheet ID and convert to CSV export URL
    const sheetIdMatch = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      throw new Error('Invalid Google Sheets URL format');
    }

    const sheetId = sheetIdMatch[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    console.log('Fetching Google Sheets data from:', csvUrl);

    // Fetch the CSV data
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheets data: ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('CSV data received, length:', csvText.length);

    // Parse CSV data
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    // Skip header row and parse data
    const trainingData: TrainingDataRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.replace(/^"|"$/g, '').trim());
      
      if (columns.length >= 3) {
        const qualityValue = columns[4] ? parseInt(columns[4]) : 5;
        trainingData.push({
          category: columns[0] || 'general',
          user_message: columns[1],
          ai_response: columns[2],
          context: columns[3] || null,
          quality: isNaN(qualityValue) ? 5 : qualityValue
        });
      }
    }

    console.log(`Parsed ${trainingData.length} training data rows`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert data into the database
    const { data, error } = await supabase
      .from('ai_training_data')
      .insert(trainingData);

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to save training data: ${error.message}`);
    }

    console.log('Successfully imported training data');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${trainingData.length} training data rows`,
        count: trainingData.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in import-google-sheets function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});