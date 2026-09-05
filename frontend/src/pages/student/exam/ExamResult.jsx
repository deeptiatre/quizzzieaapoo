import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../service/api";
import VCard from "../../../component/ui/VCard";
import VButton from "../../../component/ui/VButton";
import { CheckCircle, XCircle, Trophy, BarChart, Clock, ArrowLeft, Award } from "lucide-react";
import { motion } from "framer-motion";

const ExamResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let retries = 0;
    const fetchResult = async () => {
      try {
        const res = await api.get(`/exam/result/${attemptId}`);
        setResult(res.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 400 && retries < 5) {
          retries++;
          setTimeout(fetchResult, 1000);
        } else {
          setError(err.response?.data?.message || "Failed to load result");
          setLoading(false);
        }
      }
    };
    fetchResult();

    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/student/dashboard', { replace: true });
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [attemptId, navigate]);

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-v-bg-main gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
      <p className="text-v-text-muted font-bold animate-pulse">Loading exam result...</p>
    </div>
  );

  if (error) {
    const isUnreleased = error.toLowerCase().includes("not been released") || error.toLowerCase().includes("released yet");

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-v-bg-main">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          <VCard className="text-center p-8 md:p-10 border-2 border-v-border-color bg-v-bg-card shadow-2xl flex flex-col items-center">
            <div className="mb-6">
              <div className={`p-4 rounded-full ${isUnreleased ? 'bg-v-yellow-warning/20 text-v-yellow-warning' : 'bg-v-red-error/20 text-v-red-error'}`}>
                {isUnreleased ? <Clock size={48} /> : <XCircle size={48} />}
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              {isUnreleased ? "Exam Submitted Successfully" : "Notice"}
            </h2>

            <p className={`font-bold text-base md:text-lg mb-8 max-w-sm ${isUnreleased ? 'text-v-text-muted' : 'text-v-red-error'}`}>
              {error}
            </p>

            <div className="w-full flex justify-center">
              <VButton
                variant="primary"
                onClick={() => navigate('/student/dashboard', { replace: true })}
                className="px-8 py-3 text-base flex items-center gap-2"
              >
                <ArrowLeft size={18} /> Back to Dashboard
              </VButton>
            </div>
          </VCard>
        </motion.div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-v-bg-main py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">Exam Result</h1>
          <p className="text-v-text-muted font-bold">Here is how you performed!</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <VCard className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-2 border-v-border-color bg-v-bg-card">
            <div className="flex flex-col items-center">
              <Trophy size={32} className="text-v-yellow-warning mb-2" />
              <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Score</p>
              <p className="text-3xl font-black text-white">{result.score}</p>
            </div>
            <div className="flex flex-col items-center">
              <BarChart size={32} className="text-v-blue-primary mb-2" />
              <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Attempted</p>
              <p className="text-3xl font-black text-white">{result.attempted} <span className="text-lg text-v-text-muted">/ {result.totalQuestions}</span></p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle size={32} className="text-v-green-primary mb-2" />
              <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Correct</p>
              <p className="text-3xl font-black text-v-green-primary">{result.correct}</p>
            </div>
            <div className="flex flex-col items-center">
              <XCircle size={32} className="text-v-red-error mb-2" />
              <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Wrong</p>
              <p className="text-3xl font-black text-v-red-error">{result.wrong}</p>
            </div>
          </VCard>
        </motion.div>

        <div className="text-center">
          <p className="text-v-text-muted font-bold text-sm bg-v-bg-card inline-block px-4 py-2 rounded-full border border-v-border-color">
            <Clock size={14} className="inline mr-2" />
            Submitted: {new Date(result.submittedAt).toLocaleString()}
          </p>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-white border-b-2 border-v-border-color pb-4">Detailed Review</h2>
          {result.answers.map((ans, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (idx * 0.05) }}
            >
              <VCard className="p-6">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-v-bg-main rounded-full font-black text-white border-2 border-v-border-color">
                    {idx + 1}
                  </span>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-white mb-4">{ans.question}</h3>

                    <div className="space-y-2">
                      {ans.options.map((opt, i) => {
                        const isSelected = opt._id === ans.selectedOption;
                        const isCorrect = opt.iscorrect;

                        let styleClass = "bg-v-bg-main border-v-border-color text-v-text-muted";
                        if (isCorrect) styleClass = "bg-v-green-primary/20 border-v-green-primary text-v-green-primary font-bold";
                        else if (isSelected && !isCorrect) styleClass = "bg-v-red-error/20 border-v-red-error text-v-red-error font-bold";

                        return (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border-2 flex justify-between items-center ${styleClass}`}
                          >
                            <span>{opt.text}</span>
                            {isCorrect && <CheckCircle size={18} />}
                            {isSelected && !isCorrect && <XCircle size={18} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </VCard>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t-2 border-v-border-color">
          <VButton
            onClick={() => navigate(`/student/exam/leaderboard/${result.quizID}`)}
            variant="primary"
            className="px-8 py-3 text-lg"
          >
            <Award className="mr-2" size={20} /> View Leaderboard
          </VButton>

          <VButton
            onClick={() => navigate("/student/dashboard", { replace: true })}
            variant="outline"
            className="px-8 py-3 text-lg"
          >
            <ArrowLeft className="mr-2" size={20} /> Back to Dashboard
          </VButton>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
