import api from "./api";

export const getAllQuizzes = () =>
    api.get("/quizzes/fetch/allquizes");

export const getQuizzesByTopic = (topic) =>
    api.get(`/quizzes/fetch/topic/${topic}`);

export const getQuizzesByDifficulty = (level) =>
    api.get(`/quizzes/fetch/difficulty/${level}`);

export const startQuiz = (quizId) =>
    api.post(`/quizzes/fetch/${quizId}/start`);

export const submitQuiz = (attemptId, answers) =>
    api.post(`/attempt/${attemptId}/submit`, { answers });

export const getQuizResult = (attemptId) =>
    api.get(`/attemptmy/${attemptId}/result`);
