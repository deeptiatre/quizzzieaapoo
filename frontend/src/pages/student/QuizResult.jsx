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
                <h2 className="text-2xl font-extrabold text-white border-b-2 border-v-border-color pb-4">Detailed Review</h2>
                {data.answers.map((ans, idx) => {
                    const selectedOpt = ans.options?.find(opt => opt._id?.toString() === ans.selectedOption?.toString());
                    const correctOpt = ans.options?.find(opt => opt.iscorrect);

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <VCard className="p-6">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-v-bg-main rounded-full font-black text-white border-2 border-v-border-color">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-grow space-y-3">
                                        <h3 className="font-bold text-lg text-white">{ans.question}</h3>

                                        {ans.options && ans.options.length > 0 ? (
                                            <div className="space-y-2 mt-3">
                                                {ans.options.map((opt, i) => {
                                                    const isSelected = opt._id?.toString() === ans.selectedOption?.toString();
                                                    const isCorrect = opt.iscorrect;

                                                    let styleClass = "bg-v-bg-main border-v-border-color text-v-text-muted";
                                                    if (isCorrect) {
                                                        styleClass = "bg-v-green-primary/20 border-v-green-primary text-v-green-primary font-bold";
                                                    } else if (isSelected && !isCorrect) {
                                                        styleClass = "bg-v-red-error/20 border-v-red-error text-v-red-error font-bold";
                                                    }

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`p-3 rounded-xl border-2 flex justify-between items-center transition-colors ${styleClass}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm">{opt.text}</span>
                                                                {isSelected && (
                                                                    <span className="text-xs px-2 py-0.5 rounded-md uppercase font-black bg-white/10 text-white">
                                                                        Your Choice
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {isCorrect && <CheckCircle size={18} className="text-v-green-primary" />}
                                                            {isSelected && !isCorrect && <XCircle size={18} className="text-v-red-error" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-3 rounded-xl bg-v-bg-main border-2 border-v-border-color">
                                                <p className="text-sm">
                                                    <strong className="text-v-text-muted">Your Answer: </strong>
                                                    <span className={ans.isCorrect ? "text-v-green-primary font-bold" : "text-v-red-error font-bold"}>
                                                        {selectedOpt?.text || ans.selectedOption || "Skipped"}
                                                    </span>
                                                </p>
                                                {!ans.isCorrect && correctOpt && (
                                                    <p className="text-sm mt-1">
                                                        <strong className="text-v-text-muted">Correct Answer: </strong>
                                                        <span className="text-v-green-primary font-bold">{correctOpt.text}</span>
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </VCard>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizResult;
