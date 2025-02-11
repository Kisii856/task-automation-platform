
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';
import { Progress } from './ui/progress';

export function WorkflowExecution({ steps }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);

  const executeWorkflow = async () => {
    setIsExecuting(true);
    setProgress(0);
    try {
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
        setProgress(100);
        toast({
          title: 'Workflow executed successfully',
          description: 'All steps completed',
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Execution failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="p-4">
      <Button 
        onClick={executeWorkflow} 
        disabled={isExecuting}
        className="w-full mb-4"
      >
        {isExecuting ? 'Executing...' : 'Execute Workflow'}
      </Button>
      
      {isExecuting && (
        <Progress value={progress} className="mb-4" />
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Results:</h3>
          <ul className="list-disc pl-4">
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
