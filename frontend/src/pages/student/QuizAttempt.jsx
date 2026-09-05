import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import { submitQuiz } from "../../service/quizService";
import QuestionCard from "../../component/student/QuestionCard";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import { ChevronRight, ChevronLeft, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QuizAttempt = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/attempt/${attemptId}/questions`).then(res => {
            setQuestions(res.data.questions || []);
            if (res.data.answers) {
                setAnswers(res.data.answers);
            }
        }).catch(err => {
            console.error("Failed to load questions", err);
        });
    }, [attemptId]);

    const handleSelect = (optionId) => {
        if (!questions[index]) return;
        setAnswers(prev => ({
            ...prev,
            [questions[index]._id]: optionId
        }));
    };

    const handleNext = () => {
        if (index < questions.length - 1) {
            setIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (index > 0) {
            setIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);
        const formatted = Object.entries(answers).map(
            ([questionID, selectedOption]) => ({
                questionID,
                selectedOption
            })
        );

        try {
            await submitQuiz(attemptId, formatted);
            navigate(`/student/quiz/result/${attemptId}`, { replace: true });
        } catch (err) {
            console.error("Submit failed", err);
            navigate(`/student/quiz/result/${attemptId}`, { replace: true });
        } finally {
            setSubmitting(false);
        }
    };

    if (!questions.length) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
            </div>
        );
    }

    const currentQ = questions[index];
    const progressPercent = ((index + 1) / questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
            {/* Header: Question Counter & Progress */}
            <div className="flex justify-between items-center">
                <div className="bg-v-bg-card border-2 border-v-border-color rounded-full px-4 py-2 flex items-center gap-3">
                    <span className="text-v-text-muted font-bold text-sm uppercase">Question</span>
                    <span className="text-white font-black text-xl">
                        {index + 1} <span className="text-v-text-muted text-sm">/ {questions.length}</span>
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-v-bg-card h-3 rounded-full overflow-hidden border border-v-border-color">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-v-green-primary rounded-full transition-all duration-500 ease-out"
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <VCard className="border-2 border-v-border-color bg-v-bg-card shadow-2xl p-6 md:p-10 min-h-[350px] flex flex-col justify-between">
                        <QuestionCard
                            question={currentQ}
                            selected={answers[currentQ._id]}
                            onSelect={handleSelect}
                        />

                        {/* Navigation Buttons */}
                        <div className="mt-8 pt-6 border-t-2 border-v-border-color flex justify-between items-center">
                            <VButton
                                onClick={handlePrev}
                                disabled={index === 0}
                                variant="outline"
                                className={`px-6 ${index === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <ChevronLeft size={20} className="mr-1" /> Previous
                            </VButton>

                            {index === questions.length - 1 ? (
                                <VButton
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    variant="primary"
                                    size="lg"
                                    className="px-8 shadow-lg shadow-green-900/20"
                                >
                                    <Save size={20} className="mr-2" /> {submitting ? "Submitting..." : "Submit Quiz"}
                                </VButton>
                            ) : (
                                <VButton
                                    onClick={handleNext}
                                    variant="primary"
                                    size="lg"
                                    className="px-8"
                                >
                                    Next <ChevronRight size={20} className="ml-2" />
                                </VButton>
                            )}
                        </div>
                    </VCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default QuizAttempt;
