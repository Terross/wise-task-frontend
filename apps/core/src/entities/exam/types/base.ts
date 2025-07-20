import { TaskType } from "@/__generated__/graphql";

export type ExamTask = {
  order: number;
  taskId: string;
  progress: "COMPLETED" | "NOT_COMPLETED";
  type: TaskType;
};

export type Exam = {
  id: string;
  startTime?: string;
  name: string;
  description: string;
  overallTime: string;
  tasks: ExamTask[];
  isFinished?: boolean;
};
