import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeacherQuizzes } from "../../service/TeacherLeaderboardService";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import { Trophy, Calendar, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const LeaderboardList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const data = await getTeacherQuizzes('exam');
                setQuizzes(data.quizes || []);
            } catch (err) {
                console.error("Failed to fetch quizzes", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-black text-white mb-3 flex items-center gap-3">
                    <Trophy className="text-v-yellow-warning" size={36} />
                    Leaderboard Selection
                </h1>
                <p className="text-v-text-muted font-bold text-lg">
                    Select a quiz to view its student leaderboard and statistics.
                </p>
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-v-green-primary"></div>
                </div>
            ) : quizzes.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <VCard className="p-16 text-center border-2 border-dashed border-v-border-color">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-v-blue-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trophy className="text-v-blue-primary" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3">No Quizzes Available</h3>
                            <p className="text-v-text-muted font-bold mb-6">
                                Create a quiz first to see leaderboards and track student performance.
                            </p>
                            <Link to="/teacher/create-quiz">
                                <VButton variant="primary" className="px-6 py-3">
                                    <Sparkles size={18} />
                                    Create Your First Quiz
                                </VButton>
                            </Link>
                        </div>
                    </VCard>
                </motion.div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz, index) => {
                        const statusConfig = {
                            live: {
                                color: "text-v-green-primary",
                                bg: "bg-v-green-primary/10",
                                border: "border-v-green-primary/30",
                                label: "LIVE"
                            },
                            completed: {
                                color: "text-v-text-muted",
                                bg: "bg-v-bg-main",
                                border: "border-v-border-color",
                                label: "COMPLETED"
                            },
                            upcoming: {
                                color: "text-v-yellow-warning",
                                bg: "bg-v-yellow-warning/10",
                                border: "border-v-yellow-warning/30",
                                label: "UPCOMING"
                            }
                        };

                        const status = statusConfig[quiz.quizStatus] || statusConfig.upcoming;

                        return (
                            <motion.div
                                key={quiz._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <VCard className="h-full hover:scale-[1.02] transition-transform border-2 border-v-border-color overflow-hidden">
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start gap-3">
                                            <h3 className="text-xl font-black text-white line-clamp-2 flex-1">
                                                {quiz.title}
                                            </h3>
                                            <span className={`px-3 py-1 text-xs font-black rounded-full ${status.bg} ${status.color} border-2 ${status.border} whitespace-nowrap`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-v-text-muted">
                                            <Calendar size={16} />
                                            <span className="text-sm font-bold">
                                                {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <Link
                                            to={`/teacher/leaderboard/${quiz._id}`}
                                            className="block"
                                        >
                                            <VButton variant="primary" fullWidth className="py-3">
                                                <Eye size={18} />
                                                View Leaderboard
                                            </VButton>
                                        </Link>
                                    </div>
                                </VCard>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LeaderboardList;
