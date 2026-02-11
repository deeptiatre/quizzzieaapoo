// src/services/exam.service.js
import api from "../api"; // axios instance with token

export const joinExamAPI = async (examCode) => {
  const res = await api.post("/student/exam/join", { examCode });
  return res.data;
};
