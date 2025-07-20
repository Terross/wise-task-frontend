import { defineStore } from "pinia";
import type { Task } from "@/__generated__/graphql";

interface UseCreateExamParams {
  selectedTasks: Task[];
  name: string;
  description?: string;
  overAllTime: string;
}

export const useCreateExam = defineStore("createExam", {
  state: (): UseCreateExamParams => ({
    selectedTasks: [],
    name: "",
    description: "",
    overAllTime: "",
  }),

  actions: {
    reset() {
      this.selectedTasks = [];
      this.name = "";
      this.description = "";
      this.overAllTime = "";
    },

    addSelectedTask(task: Task) {
      if (!this.selectedTasks.find((t) => t.id === task.id)) {
        this.selectedTasks.push(task);
      }
    },

    removeSelectedTask(taskId: string) {
      this.selectedTasks = this.selectedTasks.filter(
        (task) => task.id !== taskId,
      );
    },

    setSelectedTasks(tasks: Task[]) {
      this.selectedTasks = tasks;
    },
  },
});
