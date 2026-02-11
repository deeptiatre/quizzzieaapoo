import api from "../service/api";

export const getStudentDashboard = async () => {
  const res = await api.get("/dashboard/student/studentDashboard");
  return res.data;
};
