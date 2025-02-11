import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Workflow } from "@shared/schema";
import { CheckCircle2, MousePointer, Globe, Keyboard } from "lucide-react";

const icons = {
  visit: Globe,
  click: MousePointer,
  input: Keyboard,
};

export default function WorkflowDisplay({ workflow }: { workflow: Workflow }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Task: {workflow.task}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflow.steps.map((step, index) => {
            const Icon = icons[step.action as keyof typeof icons] || CheckCircle2;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{step.description}</p>
                  {step.selector && (
                    <p className="text-sm text-muted-foreground">
                      Selector: {step.selector}
                    </p>
                  )}
                  {step.url && (
                    <p className="text-sm text-muted-foreground">
                      URL: {step.url}
                    </p>
                  )}
                  {step.value && (
                    <p className="text-sm text-muted-foreground">
                      Value: {step.value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
