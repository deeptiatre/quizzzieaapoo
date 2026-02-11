import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../service/api";
import VCard from "../../../component/ui/VCard";
import VButton from "../../../component/ui/VButton";
import { Trophy, Medal, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ExamLeaderboard = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`/exam/leaderboard/${quizID}`);
        console.log("ExamLeaderboard Data:", res.data);
        setBoard(res.data.leaderBoard);
      } catch (err) {
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizID]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Exam Leaderboard
        </h1>
        <VButton variant="outline" onClick={() => navigate('/student/dashboard')}>
          <ArrowLeft size={20} className="mr-2" /> Back
        </VButton>
      </div>

      <VCard className="p-0 overflow-hidden border-2 border-v-border-color bg-v-bg-card">
        {!board || board.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-v-text-muted font-bold text-lg">No visible rankings yet.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-v-bg-main border-b-2 border-v-border-color">
              <tr>
                <th className="p-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Rank</th>
                <th className="p-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Student</th>
                <th className="p-4 text-v-text-muted uppercase text-xs font-bold tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-v-border-color">
              {board.map((row, idx) => {
                let rankIcon = null;
                let rowClass = "hover:bg-v-bg-card-hover transition-colors";
                let rankTextClass = "text-v-text-muted font-bold";

                if (idx === 0) {
                  rankIcon = <Trophy size={20} className="text-v-yellow-warning" />;
                  rowClass += " bg-v-yellow-warning/5";
                  rankTextClass = "text-v-yellow-warning font-black text-lg";
                } else if (idx === 1) {
                  rankIcon = <Medal size={20} className="text-gray-300" />;
                  rankTextClass = "text-gray-300 font-bold text-lg";
                } else if (idx === 2) {
                  rankIcon = <Medal size={20} className="text-amber-600" />;
                  rankTextClass = "text-amber-600 font-bold text-lg";
                }

                return (
                  <motion.tr
                    key={idx}
                    className={rowClass}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 text-center ${rankTextClass}`}>{idx + 1}</span>
                        {rankIcon}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white text-lg">{row.name}</td>
                    <td className="p-4 font-black text-white text-right text-xl">{row.score}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </VCard>
    </div>
  );
};

export default ExamLeaderboard;
