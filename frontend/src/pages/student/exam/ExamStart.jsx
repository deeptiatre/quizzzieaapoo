import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../service/api";
import VButton from "../../../component/ui/VButton";
import VCard from "../../../component/ui/VCard";
import { AlertCircle, ArrowLeft, RotateCw } from "lucide-react";
import { motion } from "framer-motion";

const ExamStart = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("Initializing your exam...");
  const [error, setError] = useState(null);
  const isStartingRef = useRef(false);

  const startExam = async () => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    setError(null);

    const maxRetries = 5;
    const delay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setStatusText(attempt === 1 ? "Initializing your exam..." : `Connecting to exam (attempt ${attempt}/${maxRetries})...`);
        const res = await api.post("/exam/start-attempt", { quizID });
        const attemptId = res.data.data?.attemptId;

        if (attemptId) {
          navigate(`/student/exam/attempt/${attemptId}`, { replace: true });
          return;
        }
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err);
        const status = err.response?.status;
        const msg = err.response?.data?.message || "Unable to start exam.";

        // If user already submitted, don't retry, exit immediately
        if (status === 403 || msg.toLowerCase().includes("already submitted")) {
          setError(msg);
          isStartingRef.current = false;
          return;
        }

        // If exam is not live yet or server glitch, wait and retry
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          setError(msg);
          isStartingRef.current = false;
        }
      }
    }
  };

  useEffect(() => {
    startExam();
  }, [quizID]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-v-bg-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <VCard className="text-center p-8 border-2 border-v-border-color bg-v-bg-card shadow-2xl space-y-6">
            <div className="flex justify-center">
              <div className="bg-v-red-error/20 p-4 rounded-full text-v-red-error">
                <AlertCircle size={48} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Unable to Start Exam</h2>
              <p className="text-v-text-muted font-bold">{error}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <VButton
                variant="primary"
                onClick={() => {
                  isStartingRef.current = false;
                  startExam();
                }}
                className="flex items-center justify-center gap-2"
              >
                <RotateCw size={18} /> Retry
              </VButton>

              <VButton
                variant="outline"
                onClick={() => navigate("/student/exam", { replace: true })}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Back
              </VButton>
            </div>
          </VCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-v-bg-main gap-4 p-6">
      <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-v-green-primary"></div>
      <p className="text-white font-extrabold text-xl animate-pulse">
        {statusText}
      </p>
      <p className="text-v-text-muted font-bold text-sm">
        Please hold on, preparing your questions...
      </p>
    </div>
  );
};

export default ExamStart;
