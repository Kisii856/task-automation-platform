
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';

export function WorkflowExecution({ steps }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState([]);

  const executeWorkflow = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
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
      >
        {isExecuting ? 'Executing...' : 'Execute Workflow'}
      </Button>
      
      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Results:</h3>
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
