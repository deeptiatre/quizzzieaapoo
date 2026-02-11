import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizResult } from "../../service/quizService";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import { CheckCircle, XCircle, Trophy, BarChart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const QuizResult = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getQuizResult(attemptId).then(res => {
            setData(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [attemptId]);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
        </div>
    );

    if (!data) return <p className="text-white text-center">No result found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Quiz Result</h1>
                    <p className="text-v-text-muted font-bold">Good effort!</p>
                </div>
                <VButton variant="outline" onClick={() => navigate('/student/dashboard')}>
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </VButton>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <VCard className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-2 border-v-border-color bg-v-bg-card">
                    <div className="flex flex-col items-center">
                        <Trophy size={32} className="text-v-yellow-warning mb-2" />
                        <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Score</p>
                        <p className="text-3xl font-black text-white">{data.score}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <BarChart size={32} className="text-v-blue-primary mb-2" />
                        <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Total</p>
                        <p className="text-3xl font-black text-white">{data.wrong + data.correct + (data.skipped || 0)}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <CheckCircle size={32} className="text-v-green-primary mb-2" />
                        <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Correct</p>
                        <p className="text-3xl font-black text-v-green-primary">{data.correct}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <XCircle size={32} className="text-v-red-error mb-2" />
                        <p className="text-v-text-muted font-bold uppercase text-xs tracking-wider">Wrong</p>
                        <p className="text-3xl font-black text-v-red-error">{data.wrong}</p>
                    </div>
                </VCard>
            </motion.div>

            <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-white border-b-2 border-v-border-color pb-4">Answers</h2>
                {data.answers.map((ans, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <VCard className="p-6">
                            <h3 className="font-bold text-lg text-white mb-2">Q{idx + 1}: {ans.question}</h3>
                            <div className="flex flex-col gap-2 mt-4 text-sm">
                                <div className="flex justify-between p-3 rounded-xl bg-v-bg-main border-2 border-v-border-color">
                                    <span className="text-v-text-muted font-bold uppercase text-xs">Your Answer</span>
                                    <span className={`font-bold ${ans.isCorrect ? 'text-v-green-primary' : 'text-v-red-error'}`}>
                                        {ans.selectedOption || "Skipped"}
                                    </span>
                                </div>
                                <div className={`flex items-center gap-2 mt-2 font-bold ${ans.isCorrect ? 'text-v-green-primary' : 'text-v-red-error'}`}>
                                    {ans.isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                    <span>{ans.isCorrect ? "Correct!" : "Incorrect"}</span>
                                </div>
                            </div>
                        </VCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default QuizResult;
