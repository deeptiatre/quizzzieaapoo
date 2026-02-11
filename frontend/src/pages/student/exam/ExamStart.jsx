import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../service/api";

const ExamStart = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const startExam = async () => {
      try {
        const res = await api.post("/exam/start-attempt", {
          quizID,
        });

        const attemptId = res.data.data.attemptId;

        navigate(`/student/exam/attempt/${attemptId}`);
      } catch (err) {
        console.error(err);

        alert(
          err.response?.data?.message ||
          "Unable to start exam. Please try again."
        );

        navigate("/student/exam");
      }
    };

    startExam();
  }, [quizID, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-lg font-semibold animate-pulse">
        Initializing your exam...
      </p>
    </div>
  );
};

export default ExamStart;
