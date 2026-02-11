import { Routes, Route } from "react-router-dom";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";

import StudentDashboard from "../pages/student/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import QuizStats from "../pages/teacher/QuizStats";
import QuizList from "../pages/student/QuizList";
import TopicQuizzes from "../pages/student/TopicQuizzes";
import StartQuiz from "../pages/student/StartQuiz";
import QuizAttempt from "../pages/student/QuizAttempt";
import QuizResult from "../pages/student/QuizResult";

import PrivateRoute from "../auth/PrivateRoute";
import RoleRoute from "../../src/auth/RoleRoute";
import StudentTeacherLayout from "../component/Layout/StudentTeacherLayout";
import Home from "../pages/public/Home";
import CreateQuiz from "../pages/teacher/CreateQuiz";
import ManageQuiz from "../pages/teacher/ManageQuiz";
import EnableExam from "../pages/teacher/EnableExam";
import MyQuizzes from "../pages/teacher/MyQuiz";
import ExamEntry from "../pages/student/exam/ExamEntry";
import ExamWaiting from "../pages/student/exam/ExamWaiting";
import ExamStart from "../pages/student/exam/ExamStart";
import ExamAttempt from "../pages/student/exam/ExamAttempt";
import ExamResult from "../pages/student/exam/ExamResult";
import ExamLeaderboard from "../pages/student/exam/ExamLeaderboard";
import MyAttempts from "../pages/student/MyAttempts";
import LeaderboardList from "../pages/student/LeaderboardList";
import TeacherLeaderboardList from "../pages/teacher/LeaderboardList";
import TeacherQuizLeaderboard from "../pages/teacher/TeacherQuizLeaderboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* STUDENT */}
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <StudentDashboard />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/quizzes"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <QuizList />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/quizzes/topic/:topic"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <TopicQuizzes />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/quiz/start/:quizId"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <StartQuiz />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/quiz/attempt/:attemptId"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <QuizAttempt />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/quiz/result/:attemptId"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <QuizResult />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/attempts"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <MyAttempts />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/student/leaderboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="student">
              <StudentTeacherLayout>
                <LeaderboardList />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      {/* TEACHER */}
      <Route
        path="/teacher/dashboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <TeacherDashboard />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />
      {/* ================= TEACHER create quiz ================= */}
      <Route
        path="/teacher/create-quiz"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <CreateQuiz />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />


      <Route
        path="/teacher/quiz/:quizId/manage"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <ManageQuiz />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/quiz/:quizId/enable-exam"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <EnableExam />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />


      <Route
        path="/teacher/my-quizzes"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <MyQuizzes />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/leaderboard"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <TeacherLeaderboardList />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/leaderboard/:quizId"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <TeacherQuizLeaderboard />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />



      <Route
        path="/teacher/quiz/:quizId/stats"
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="teacher">
              <StudentTeacherLayout>
                <QuizStats />
              </StudentTeacherLayout>
            </RoleRoute>
          </PrivateRoute>
        }
      />


      <Route path="/student/exam" element={<ExamEntry />} />
      <Route path="/student/exam/waiting/:quizID" element={<ExamWaiting />} />
      <Route path="/student/exam/start/:quizID" element={<ExamStart />} />
      <Route path="/student/exam/attempt/:attemptId" element={<ExamAttempt />} />
      <Route path="/student/exam/result/:attemptId" element={<ExamResult />} />
      <Route path="/student/exam/leaderboard/:quizID" element={<ExamLeaderboard />} />


    </Routes>


  );
};

export default AppRoutes;
