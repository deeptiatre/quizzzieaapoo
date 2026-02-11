import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../service/api";
import QuestionCard from "../../../component/student/QuestionCard";
import VCard from "../../../component/ui/VCard";
import VButton from "../../../component/ui/VButton";
import { Clock, AlertTriangle, ChevronRight, CheckCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ExamAttempt = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);

    const submittedRef = useRef(false);
    const handleSubmitRef = useRef(null);

    // 🔹 Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get(
                    `/exam/attempt/${attemptId}/questions`
                );
                setQuestions(res.data.questions);

                if (res.data.answers) {
                    setAnswers(res.data.answers);
                }

                if (res.data.remainingSeconds !== undefined) {
                    setTimeLeft(res.data.remainingSeconds);
                }

                const savedIndex = localStorage.getItem(`exam_current_q_${attemptId}`);
                if (savedIndex) {
                    const idx = Number(savedIndex);
                    if (idx >= 0 && idx < res.data.questions.length) {
                        setCurrent(idx);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch exam", err);
            }
        };

        fetchQuestions();
    }, [attemptId]);

    // Save current index
    useEffect(() => {
        if (current >= 0) {
            localStorage.setItem(`exam_current_q_${attemptId}`, current);
        }
    }, [current, attemptId]);

    const handleAnswer = (qid, optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [qid]: optionIndex,
        }));
    };

    const handleSubmit = async (reason = "manual") => {
        if (submittedRef.current) return;
        submittedRef.current = true;

        const payload = Object.entries(answers).map(
            ([questionID, selectedOption]) => ({
                questionID,
                selectedOption,
            })
        );

        try {
            await api.post(`/attempt/${attemptId}/submit`, {
                answers: payload,
                submitReason: reason,
            });
        } catch (err) {
            console.error("Submit failed:", err);
            alert("Submitting exam...");
        } finally {
            navigate(`/student/exam/result/${attemptId}`, { replace: true });
        }
    };

    useEffect(() => {
        handleSubmitRef.current = handleSubmit;
    });

    // 🔹 Timer
    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft === 0 && !submittedRef.current) {
            if (handleSubmitRef.current) {
                handleSubmitRef.current("time");
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // 🔹 Tab switch detection
    useEffect(() => {
        const handleVisibility = async () => {
            if (document.hidden) {
                try {
                    const res = await api.post(`/attempt/${attemptId}/violation`);
                    if (res.data.attemptId) {
                        alert("Exam auto-submitted due to tab switching violations.");
                        navigate(`/student/exam/result/${attemptId}`, { replace: true });
                    } else if (res.data.remainingTabSwitches !== undefined) {
                        const remaining = res.data.remainingTabSwitches;
                        if (remaining <= 0) {
                            alert("Maximum tab switches exceeded. Auto-submitting exam now.");
                            navigate(`/student/exam/result/${attemptId}`, { replace: true });
                        } else if (remaining === 1) {
                            alert("CRITICAL WARNING: This is your LAST warning! The next tab switch will automatically SUBMIT your exam.");
                        } else {
                            alert(`Warning: Tab switching is not allowed! You have ${remaining} attempts remaining before auto-submission.`);
                        }
                    }
                } catch (err) {
                    console.error("Violation API Error:", err);
                    alert("Warning: Connection to server unstable during violation check. Please check your network.");
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [attemptId, navigate]);

    // 🔹 Polling for Force End status
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                if (submittedRef.current) return;
                const res = await api.get(`/attempt/${attemptId}/status`);
                if (res.data.endedAt || res.data.status === 'completed') {
                    alert("The teacher has ended the exam. You are being redirected.");
                    submittedRef.current = true;
                    navigate(`/student/exam/result/${attemptId}`, { replace: true });
                }
            } catch (e) {
                console.error("Status polling failed", e);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [attemptId, navigate]);

    // 🔹 Disable copy paste
    useEffect(() => {
        const block = (e) => e.preventDefault();
        document.addEventListener("copy", block);
        document.addEventListener("paste", block);
        document.addEventListener("cut", block);
        return () => {
            document.removeEventListener("copy", block);
            document.removeEventListener("paste", block);
            document.removeEventListener("cut", block);
        };
    }, []);

    if (!questions.length) return (
        <div className="flex justify-center items-center h-screen bg-v-bg-main">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
                <p className="text-white font-bold text-lg animate-pulse">Preparing your exam...</p>
            </div>
        </div>
    );

    const q = questions[current];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");
    const isCriticalTime = timeLeft < 60; // Less than 1 minute

    return (
        <div className="min-h-screen bg-v-bg-main p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl space-y-6">

                {/* Header: Progress & Timer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="w-full md:w-auto">
                        <div className="bg-v-bg-card border-2 border-v-border-color rounded-full px-4 py-2 flex items-center gap-3">
                            <span className="text-v-text-muted font-bold text-sm uppercase">Question</span>
                            <span className="text-white font-black text-xl">{current + 1} <span className="text-v-text-muted text-sm">/ {questions.length}</span></span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: isCriticalTime ? [1, 1.05, 1] : 1 }}
                        transition={{ repeat: isCriticalTime ? Infinity : 0, duration: 1 }}
                        className={`px-6 py-2 rounded-full border-2 flex items-center gap-3 font-mono text-xl font-black shadow-lg ${isCriticalTime ? 'bg-v-red-error text-white border-v-red-error' : 'bg-v-bg-card text-v-blue-primary border-v-border-color'}`}
                    >
                        <Clock size={22} className={isCriticalTime ? "animate-pulse" : ""} />
                        {minutes}:{seconds}
                    </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-v-bg-card h-3 rounded-full overflow-hidden border border-v-border-color">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                        className="h-full bg-v-green-primary rounded-full transition-all duration-500 ease-out"
                    />
                </div>

                {/* Question Area */}
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <VCard className="border-2 border-v-border-color bg-v-bg-card shadow-2xl p-6 md:p-10 min-h-[400px] flex flex-col justify-between">
                        <QuestionCard
                            question={q}
                            selected={answers[q._id]}
                            onSelect={(opt) => handleAnswer(q._id, opt)}
                        />

                        <div className="mt-8 pt-6 border-t-2 border-v-border-color flex justify-end items-center">
                            {current === questions.length - 1 ? (
                                <VButton
                                    onClick={() => handleSubmit("manual")}
                                    variant="danger"
                                    size="lg"
                                    className="px-8 shadow-lg shadow-red-900/20"
                                >
                                    <Save size={20} className="mr-2" /> Submit Exam
                                </VButton>
                            ) : (
                                <VButton
                                    onClick={() => setCurrent((c) => c + 1)}
                                    variant="primary"
                                    size="lg"
                                    className="px-8"
                                >
                                    Next Question <ChevronRight size={20} className="ml-2" />
                                </VButton>
                            )}
                        </div>
                    </VCard>
                </motion.div>
            </div>
        </div>
    );
};

export default ExamAttempt;
