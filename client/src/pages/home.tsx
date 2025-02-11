import { Card, CardContent } from "@/components/ui/card";
import TaskInput from "@/components/task-input";
import WorkflowDisplay from "@/components/workflow-display";
import { useQuery } from "@tanstack/react-query";
import type { Workflow } from "@shared/schema";

export default function Home() {
  const { data: workflows } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Task Automation Platform
          </h1>
          <p className="text-muted-foreground">
            Describe your task in natural language and we'll create an automated workflow
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <TaskInput />
          </CardContent>
        </Card>

        {workflows?.map((workflow) => (
          <WorkflowDisplay key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
}
