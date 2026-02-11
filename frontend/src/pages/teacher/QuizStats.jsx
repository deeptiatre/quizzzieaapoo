import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../service/api";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

const QuizStats = () => {
  const { quizId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(
          `/dashboard/teacher/teacherQuiz/${quizId}/stats`
        );
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [quizId]);

  if (loading) return <div className="p-8 text-center text-v-text-muted font-bold animate-pulse">Loading stats...</div>;
  if (!stats) return <div className="p-8 text-center text-v-red-error font-bold">Failed to load stats</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-v-green-primary tracking-wide">Quiz Statistics</h1>
        <VButton variant="secondary" onClick={() => window.history.back()}>Back</VButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VCard className="flex flex-col items-center justify-center py-8 bg-v-bg-card">
          <span className="text-v-text-muted uppercase font-bold text-sm tracking-wider">Total Attempts</span>
          <span className="text-5xl font-extrabold text-v-blue-primary mt-2">{stats.totalAttempt}</span>
        </VCard>

        <VCard className="flex flex-col items-center justify-center py-8 bg-v-bg-card">
          <span className="text-v-text-muted uppercase font-bold text-sm tracking-wider">Auto Submitted</span>
          <span className="text-5xl font-extrabold text-v-yellow-warning mt-2">{stats.autoSubmitted}</span>
        </VCard>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-8 h-8 text-v-yellow-warning" />
          Leaderboard
        </h2>

        {stats.leaderBoard.length === 0 ? (
          <VCard className="text-center py-12 text-v-text-muted">No attempts yet. Be the first!</VCard>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-4 px-6 py-2 text-v-text-muted font-bold text-sm uppercase tracking-wider">
              <div className="col-span-2">Rank</div>
              <div className="col-span-7">Student</div>
              <div className="col-span-3 text-right">Score</div>
            </div>

            {stats.leaderBoard.map((u, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <VCard className={`grid grid-cols-12 gap-4 items-center !p-4 ${i < 3 ? 'border-v-yellow-warning border-2' : ''}`} hoverEffect>
                  <div className="col-span-2 font-extrabold text-xl flex items-center gap-2">
                    {i === 0 && <Trophy className="w-6 h-6 text-v-yellow-warning" />}
                    {i === 1 && <Medal className="w-6 h-6 text-gray-300" />}
                    {i === 2 && <Award className="w-6 h-6 text-orange-400" />}
                    <span className={i < 3 ? "text-v-yellow-warning" : "text-v-text-muted"}>#{i + 1}</span>
                  </div>
                  <div className="col-span-7 font-bold text-white truncate text-lg">
                    {u.name}
                  </div>
                  <div className="col-span-3 text-right font-extrabold text-v-green-primary text-xl">
                    {u.score} XP
                  </div>
                </VCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizStats;
