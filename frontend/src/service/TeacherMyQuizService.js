import api from "./api";

export const fetchTeacherQuizzes = async () => {
  const res = await api.get("/dashboard/teacher/teacherQuizzes");
  return res.data.quizes;
};
