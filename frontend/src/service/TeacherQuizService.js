import api from "./api";

/* QUIZ */
export const createQuiz = (data) =>
  api.post("/quizzes/create", data);

export const getQuizById = (quizId) =>
  api.get(`/quizzes/fetch/${quizId}`);

/* QUESTIONS */
export const addQuestion = (quizId, data) =>
  api.post(`/quizzes/${quizId}/addquestions`, data);

export const updateQuestion = (questionId, data) =>
  api.put(`/quizzes/${questionId}/update`, data);

export const deleteQuestion = (questionId) =>
  api.delete(`/quizzes/${questionId}/delete`);

export const publishQuiz = (quizId) =>
  api.put(`/quizzes/${quizId}/publish`);
