import { useEffect, useState } from "react";
import { getAllQuizzes } from "../../service/quizService";
import { useNavigate } from "react-router-dom";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import { Trophy, Calendar, Hash, Activity } from "lucide-react";
import { motion } from "framer-motion";

const LeaderboardList = () => {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllQuizzes()
            .then(res => {
                const allQuizzes = res.data.quizes || [];
                // Filter: ONLY Exams that the student has ATTEMPTED
                const examQuizzes = allQuizzes.filter(q => q.quizType === 'exam' && q.attempted);
                setExams(examQuizzes);
            })
            .catch(err => console.error("LeaderboardList Error:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-extrabold text-white tracking-wide mb-2">Exam Leaderboards</h1>
                <p className="text-v-text-muted font-bold">Check your standing in past exams.</p>
            </motion.div>

            <VCard className="p-0 overflow-hidden border-2 border-v-border-color bg-v-bg-card shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-v-bg-main border-b-2 border-v-border-color">
                        <tr>
                            <th className="p-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Exam Title</th>
                            <th className="p-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Topic</th>
                            <th className="p-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Status</th>
                            <th className="p-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Your Rank</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-v-border-color">
                        {exams.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-v-text-muted font-bold text-lg">
                                    No Attempted Exams found. <br />
                                    <span className="text-sm font-normal opacity-70">Only exams you have taken will appear here.</span>
                                </td>
                            </tr>
                        ) : (
                            exams.map((exam, idx) => (
                                <motion.tr
                                    key={exam._id}
                                    className="hover:bg-v-bg-card-hover transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-v-blue-primary/20 rounded-lg text-v-blue-primary">
                                                <Trophy size={20} />
                                            </div>
                                            <span className="font-bold text-white text-lg">{exam.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-v-text-muted font-bold capitalize">
                                            <Hash size={16} />
                                            {exam.topic}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border-2 ${exam.quizStatus === 'live'
                                                ? 'bg-v-green-primary/20 border-v-green-primary text-v-green-primary'
                                                : exam.quizStatus === 'completed'
                                                    ? 'bg-v-bg-main border-v-border-color text-v-text-muted'
                                                    : 'bg-v-yellow-warning/20 border-v-yellow-warning text-v-yellow-warning'
                                            }`}>
                                            {exam.quizStatus === 'live' ? 'Running' : 'Ended'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-black text-xl text-v-blue-primary">
                                            #{exam.myRank || "-"}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </VCard>
        </div>
    );
};

export default LeaderboardList;
