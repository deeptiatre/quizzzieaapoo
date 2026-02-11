import { useEffect, useState } from "react";
import api from "../../service/api";
import { useNavigate } from "react-router-dom";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import { Clock, CheckCircle, AlertTriangle, FileText, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const MyAttempts = () => {
    const [attempts, setAttempts] = useState([]);
    const [activeTab, setActiveTab] = useState("normal"); // 'normal' | 'exam'
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await api.get("/dashboard/student/studentattempt");
                if (res.data.success) {
                    setAttempts(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching attempts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    const filteredAttempts = attempts.filter(
        (a) => (a.quizID?.quizType || "normal") === activeTab
    );

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
                <h1 className="text-3xl font-extrabold text-white tracking-wide mb-2">My Quiz History</h1>
                <p className="text-v-text-muted font-bold">Track your progress and review your results.</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-4 border-b-2 border-v-border-color pb-4">
                <button
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "normal"
                        ? "bg-v-blue-primary text-white shadow-lg transform scale-105"
                        : "bg-v-bg-card text-v-text-muted hover:bg-v-bg-card-hover"
                        }`}
                    onClick={() => setActiveTab("normal")}
                >
                    Normal Quizzes
                </button>
                <button
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === "exam"
                        ? "bg-v-blue-primary text-white shadow-lg transform scale-105"
                        : "bg-v-bg-card text-v-text-muted hover:bg-v-bg-card-hover"
                        }`}
                    onClick={() => setActiveTab("exam")}
                >
                    Exam Quizzes
                </button>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredAttempts.length === 0 ? (
                    <div className="text-center py-12 bg-v-bg-card rounded-2xl border-2 border-v-border-color border-dashed">
                        <FileText size={48} className="mx-auto text-v-text-muted mb-4 opacity-50" />
                        <p className="text-v-text-muted font-bold text-lg">No attempts found in this category.</p>
                    </div>
                ) : (
                    filteredAttempts.map((attempt, idx) => (
                        <motion.div
                            key={attempt._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <VCard className="flex flex-col md:flex-row justify-between items-center gap-4 hover:border-v-blue-primary transition-colors group">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-extrabold text-white group-hover:text-v-blue-primary transition-colors">
                                        {attempt.quizID?.title || "Unknown Quiz"}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm font-bold text-v-text-muted">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            <span>
                                                {new Date(attempt.createdAt).toLocaleDateString()} • {new Date(attempt.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-v-yellow-warning">
                                            <Trophy size={14} />
                                            <span>Score: {attempt.score}</span>
                                        </div>
                                        {attempt.quizID?.quizType === 'exam' && (
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs uppercase tracking-wider ${attempt.autoSubmitted ? 'bg-v-red-error/20 text-v-red-error' : 'bg-v-green-primary/20 text-v-green-primary'}`}>
                                                {attempt.autoSubmitted ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                                                {attempt.autoSubmitted ? "Auto Submitted" : "Manual Submit"}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <VButton
                                        onClick={() => navigate(`/student/quiz/result/${attempt._id}`)}
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1 md:flex-none"
                                    >
                                        View Result
                                    </VButton>

                                    {attempt.quizID?.quizType === 'exam' && (
                                        <VButton
                                            onClick={() => navigate(`/student/exam/leaderboard/${attempt.quizID._id}`)}
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1 md:flex-none text-v-yellow-warning hover:bg-v-yellow-warning/10"
                                        >
                                            <Trophy size={16} className="mr-1" /> Rank
                                        </VButton>
                                    )}
                                </div>
                            </VCard>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAttempts;
