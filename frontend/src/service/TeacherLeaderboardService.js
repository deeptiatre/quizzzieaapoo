import api from "./api";

export const getTeacherQuizzes = async (type) => {
    const url = type
        ? `/dashboard/teacher/teacherquizzes?type=${type}`
        : "/dashboard/teacher/teacherquizzes";

    const res = await api.get(url);
    return res.data;
};

export const getTeacherQuizLeaderboard = async (quizId) => {
    const res = await api.get(`/leaderBoard/${quizId}/teacher-leaderboard`);
    return res.data;
};
