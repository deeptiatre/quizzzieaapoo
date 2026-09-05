import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import VCard from "../ui/VCard";
import VButton from "../ui/VButton";
import { Play, RotateCw, CheckCircle, BookOpen, BarChart } from "lucide-react";

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const res = await api.post(`/quizzes/fetch/${quiz._id}/start`);
      // Statuses: start, resume
      navigate(`/student/quiz/attempt/${res.data.attemptId}`);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.attemptId) {
        // Resume if already started
        navigate(`/student/quiz/attempt/${err.response.data.attemptId}`);
      } else {
        alert(err.response?.data?.message || "Failed to start quiz");
      }
    }
  };

  const difficultyColors = {
    easy: "text-v-green-primary bg-v-green-primary/10 border-v-green-primary",
    medium: "text-v-yellow-warning bg-v-yellow-warning/10 border-v-yellow-warning",
    hard: "text-v-red-error bg-v-red-error/10 border-v-red-error"
  };

  const diffColor = difficultyColors[quiz.diffcultylevel?.toLowerCase()] || difficultyColors.easy;

  return (
    <VCard className="flex flex-col h-full justify-between hover:border-v-blue-primary transition-colors duration-200 group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 ${diffColor}`}>
            {quiz.diffcultylevel}
          </span>
          <span className="text-v-text-muted text-xs font-bold flex items-center gap-1">
            <BarChart size={14} /> {quiz.totalmarks} PTS
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white mb-2 line-clamp-2 group-hover:text-v-blue-primary transition-colors">
          {quiz.title}
        </h3>
        <p className="text-v-text-muted text-sm font-bold line-clamp-2 mb-6">
          {quiz.discription || "No description provided."}
        </p>

        <div className="flex items-center gap-2 mb-6">
          <span className="bg-v-bg-main border-2 border-v-border-color px-3 py-1 rounded-xl text-xs font-bold text-v-text-muted flex items-center gap-2">
            <BookOpen size={14} /> {quiz.topic || "General"}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t-2 border-v-border-color flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          {quiz.completed ? (
            <span className="text-v-green-primary font-bold text-sm flex items-center gap-1">
              <CheckCircle size={16} /> Completed
            </span>
          ) : quiz.attempted ? (
            <span className="text-v-yellow-warning font-bold text-sm flex items-center gap-1">
              <RotateCw size={16} /> In Progress
            </span>
          ) : (
            <span className="text-v-text-muted font-bold text-sm">Not Started</span>
          )}
        </div>

        <VButton
          onClick={handleStart}
          variant={quiz.completed ? "secondary" : "primary"}
          className="px-6 py-2 text-sm"
        >
          {quiz.completed ? 'Re-take' : (quiz.attempted ? 'Resume' : 'Start')} <Play size={16} className="ml-1" fill="currentColor" />
        </VButton>
      </div>
    </VCard>
  );
};

export default QuizCard;
