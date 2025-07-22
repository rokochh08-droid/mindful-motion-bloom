import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Database, CheckCircle, XCircle } from "lucide-react";

interface TrainingData {
  category: string;
  userMessage: string;
  aiResponse: string;
  context: string;
  quality: number;
}

interface CSVImportProps {
  onDataImported?: (data: TrainingData[]) => void;
}

export const CSVImport = ({ onDataImported }: CSVImportProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<{
    total: number;
    successful: number;
    errors: number;
  } | null>(null);

  const parseCSV = (csvText: string): TrainingData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    const data: TrainingData[] = [];
    const errors: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        // Handle CSV parsing with potential commas in quoted fields
        const values = parseCSVLine(lines[i]);
        
        if (values.length < 4) {
          errors.push(`Line ${i + 1}: Insufficient columns`);
          continue;
        }
        
        const trainingItem: TrainingData = {
          category: values[0]?.trim() || '',
          userMessage: values[1]?.trim() || '',
          aiResponse: values[2]?.trim() || '',
          context: values[3]?.trim() || '',
          quality: parseInt(values[4]?.trim() || '5') || 5
        };
        
        if (!trainingItem.userMessage || !trainingItem.aiResponse) {
          errors.push(`Line ${i + 1}: Missing required fields`);
          continue;
        }
        
        data.push(trainingItem);
      } catch (error) {
        errors.push(`Line ${i + 1}: Parse error`);
      }
    }
    
    if (errors.length > 0) {
      console.warn('CSV parsing errors:', errors);
    }
    
    return data;
  };

  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values.map(v => v.replace(/^"|"$/g, ''));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      // Store in localStorage
      const existingData = JSON.parse(localStorage.getItem('aiCoachTrainingData') || '[]');
      const updatedData = [...existingData, ...parsedData];
      localStorage.setItem('aiCoachTrainingData', JSON.stringify(updatedData));
      
      const stats = {
        total: parsedData.length,
        successful: parsedData.length,
        errors: 0
      };
      
      setImportStats(stats);
      onDataImported?.(parsedData);
      
      toast({
        title: "Import Successful",
        description: `Imported ${stats.successful} training conversations`,
      });
      
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error processing your CSV file",
        variant: "destructive",
      });
      console.error('CSV import error:', error);
    } finally {
      setIsProcessing(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const getStoredDataCount = (): number => {
    const data = JSON.parse(localStorage.getItem('aiCoachTrainingData') || '[]');
    return data.length;
  };

  const clearTrainingData = () => {
    localStorage.removeItem('aiCoachTrainingData');
    setImportStats(null);
    toast({
      title: "Training Data Cleared",
      description: "All imported training data has been removed",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>AI Coach Training</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Import CSV with columns: Category, User Message, AI Response, Context, Quality</p>
          <p className="mt-2">Current training data: <span className="font-medium">{getStoredDataCount()} conversations</span></p>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="csv-upload"
            />
            <Button
              variant="outline"
              disabled={isProcessing}
              className="w-full"
              asChild
            >
              <label htmlFor="csv-upload" className="cursor-pointer flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Upload CSV'}</span>
              </label>
            </Button>
          </div>
          
          {getStoredDataCount() > 0 && (
            <Button
              variant="outline"
              onClick={clearTrainingData}
              size="sm"
              className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Clear Training Data
            </Button>
          )}
        </div>
        
        {importStats && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Import Complete</span>
            </div>
            <div className="mt-2 text-sm">
              <p>Successfully imported: {importStats.successful}</p>
              <p>Total conversations: {getStoredDataCount()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};