import { ExamCRUDProxy } from "@/entities/exam/api/exam.proxy";

export class ExamExecutionProxy {
  static startExam = (examId: string): boolean => {
    return ExamCRUDProxy.updateExam(examId, { startTime: String(+new Date()) });
  };

  static completeTask = (examId: string, taskOrder: number) => {
    const exam = ExamCRUDProxy.getExamById(examId);
    if (!exam) {
      return false;
    }
    const orderIndex = exam.tasks.findIndex((task) => task.order === taskOrder);
    if (orderIndex === -1) {
      return false;
    }

    exam.tasks[orderIndex].progress = "COMPLETED";
    return ExamCRUDProxy.updateExam(examId, exam);
  };

  static finishExam = (examId: string): boolean => {
    const exam = ExamCRUDProxy.getExamById(examId);
    if (!exam) {
      return false;
    }
    exam.isFinished = true;
    return ExamCRUDProxy.updateExam(examId, exam);
  };
}
