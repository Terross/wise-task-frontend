import { LocalStorageKeys } from "@/shared/config/localStorageKeys";
import { Exam, ExamTask } from "@/entities/exam/types/base";
import { Task } from "@/__generated__/graphql";

export class ExamCRUDProxy {
  static getExamsList = (): Exam[] => {
    try {
      const exams: string | null = localStorage.getItem(
        LocalStorageKeys.EXAMS_LIST,
      );
      if (!exams) {
        return [];
      }
      return JSON.parse(exams);
    } catch (e) {
      return [];
    }
  };

  static saveExamsList = (exams: Exam[]): boolean => {
    try {
      localStorage.setItem(LocalStorageKeys.EXAMS_LIST, JSON.stringify(exams));
      return true;
    } catch (e) {
      return false;
    }
  };

  static createExam = (data: {
    name: string;
    description: string;
    overallTime: string;
    tasks: Task[];
  }): boolean => {
    try {
      const examTasks: ExamTask[] = data.tasks.map((task, index) => {
        return {
          order: index + 1,
          taskId: task.id,
          progress: "NOT_COMPLETED",
          type: task.taskType,
        };
      });

      let examId: string;
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        examId = crypto.randomUUID();
      } else {
        examId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0,
              v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          },
        );
      }

      const exams: Exam[] = this.getExamsList();
      exams.push({
        id: examId,
        name: data.name,
        description: data.description,
        tasks: examTasks,
        overallTime: data.overallTime,
      });

      return this.saveExamsList(exams);
    } catch (e) {
      return false;
    }
  };

  static getExamById = (id: string): Exam | null => {
    const exams = this.getExamsList();
    return exams.find((exam) => exam.id === id) || null;
  };

  static updateExam = (id: string, data: Partial<Exam>): boolean => {
    try {
      const exams = this.getExamsList();
      const index = exams.findIndex((exam) => exam.id === id);
      if (index === -1) return false;

      exams[index] = { ...exams[index], ...data };
      return this.saveExamsList(exams);
    } catch (e) {
      return false;
    }
  };

  static deleteExam = (id: string): boolean => {
    try {
      const exams = this.getExamsList().filter((exam) => exam.id !== id);
      return this.saveExamsList(exams);
    } catch (e) {
      return false;
    }
  };
}
