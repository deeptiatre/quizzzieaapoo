import api from "./api";

/* existing exports remain same */

export const enableExamMode = (quizId, examConfig) =>
    api.post(`/teacher/quiz/${quizId}/enable-exam`, examConfig);
