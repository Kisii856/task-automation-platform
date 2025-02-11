import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function TaskInput() {
  const [task, setTask] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (task: string) => {
      const res = await apiRequest("POST", "/api/workflows", { task, steps: [] });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workflows"] });
      setTask("");
      toast({
        title: "Success",
        description: "Workflow generated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate workflow",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!task.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task description",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(task);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Describe your task here... (e.g., 'Search for products on Amazon and compare prices')"
        className="h-32 resize-none"
      />
      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Workflow...
          </>
        ) : (
          "Generate Workflow"
        )}
      </Button>
    </div>
  );
}
