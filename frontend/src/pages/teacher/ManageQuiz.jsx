import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import VInput from "../../component/ui/VInput";
import { Plus, Trash2, Save, Rocket, Shield, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

import {
    getQuizById,
    addQuestion,
    deleteQuestion,
    publishQuiz
} from "../../service/TeacherQuizService";

const ManageQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    /* NEW QUESTION STATE */
    const [questionText, setQuestionText] = useState("");
    const [mark, setMark] = useState(1);
    const [options, setOptions] = useState([
        { text: "", iscorrect: false },
        { text: "", iscorrect: false },
    ]);

    const fetchQuiz = async () => {
        try {
            const res = await getQuizById(quizId);
            setQuiz(res.data.quiz);
        } catch (err) {
            console.error("Fetch quiz failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    /* ADD QUESTION */
    const handleAddQuestion = async () => {
        try {
            await addQuestion(quizId, {
                questiontext: questionText,
                mark,
                options,
            });
            setQuestionText("");
            setOptions([
                { text: "", iscorrect: false },
                { text: "", iscorrect: false },
            ]);
            fetchQuiz();
        } catch (err) {
            alert(err.response?.data?.message || "Add question failed");
        }
    };

    /* DELETE QUESTION */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete question?")) return;
        await deleteQuestion(id);
        fetchQuiz();
    };

    /* PUBLISH HANDLER */
    const handlePublish = async () => {
        if (!window.confirm("Publish this quiz? It will be visible to students immediately as a Normal Quiz.")) return;
        try {
            await publishQuiz(quizId);
            alert("Quiz Published!");
            navigate("/teacher/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Publish failed");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
        </div>
    );

    if (!quiz) return <p className="text-white text-center py-10">Quiz not found</p>;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b-2 border-v-border-color pb-6"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-wide mb-1 opacity-90">{quiz.title}</h1>
                    <p className="text-v-text-muted font-bold">Manage questions and publish settings.</p>
                </div>
                <VButton variant="outline" onClick={() => navigate("/teacher/dashboard")}>
                    <ArrowLeft size={18} className="mr-2" /> Back
                </VButton>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* QUESTIONS LIST (LEFT COLUMN) */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Questions ({quiz.questions?.length || 0})</h2>
                    <div className="space-y-4">
                        {quiz.questions?.length === 0 && (
                            <div className="p-8 text-center text-v-text-muted bg-v-bg-card rounded-2xl border-2 border-v-border-color border-dashed">
                                No questions added yet.
                            </div>
                        )}
                        {quiz.questions?.map((q, idx) => (
                            <motion.div
                                key={q._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <VCard className="relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-v-bg-main rounded-full font-black text-white border-2 border-v-border-color text-sm">
                                                {idx + 1}
                                            </span>
                                            <h3 className="font-bold text-white text-lg">{q.questiontext}</h3>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            className="text-v-text-muted hover:text-v-red-error transition-colors p-2"
                                            title="Delete Question"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="pl-11">
                                        <p className="text-sm font-bold text-v-text-muted mb-3 uppercase tracking-wide">Marks: {q.mark}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.options?.map((opt, i) => (
                                                <div key={i} className={`text-sm p-2 rounded-lg border-2 ${opt.iscorrect ? 'bg-v-green-primary/10 border-v-green-primary text-v-green-primary font-bold' : 'bg-v-bg-main border-v-border-color text-v-text-muted'}`}>
                                                    {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </VCard>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ADD QUESTION & ACTIONS (RIGHT COLUMN) */}
                <div className="space-y-6">
                    <VCard>
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Plus className="bg-v-blue-primary rounded-full p-1" size={24} /> Add Question
                        </h2>

                        <div className="space-y-4">
                            <VInput
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                placeholder="Enter question..."
                                label="Question Text"
                            />

                            <VInput
                                type="number"
                                value={mark}
                                onChange={(e) => setMark(+e.target.value)}
                                label="Marks"
                            />

                            <div className="space-y-2">
                                <label className="font-bold text-v-text-muted uppercase text-sm">Options</label>
                                {options.map((opt, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={opt.text}
                                            onChange={(e) => {
                                                const newOpt = [...options];
                                                newOpt[i].text = e.target.value;
                                                setOptions(newOpt);
                                            }}
                                            placeholder={`Option ${i + 1}`}
                                            className="flex-1 bg-v-bg-main border-2 border-v-border-color rounded-xl px-4 py-2 text-white font-bold focus:outline-none focus:border-v-blue-primary transition-colors text-sm"
                                        />
                                        <button
                                            title="Mark as correct"
                                            onClick={() => {
                                                const newOpt = [...options];
                                                newOpt[i].iscorrect = !newOpt[i].iscorrect;
                                                setOptions(newOpt);
                                            }}
                                            className={`p-2 rounded-xl border-2 transition-colors ${opt.iscorrect ? 'bg-v-green-primary border-v-green-primary text-white' : 'bg-v-bg-main border-v-border-color text-v-text-muted hover:text-white'}`}
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <VButton
                                onClick={handleAddQuestion}
                                fullWidth
                                variant="secondary"
                                className="mt-2"
                            >
                                Add Question
                            </VButton>
                        </div>
                    </VCard>

                    <VCard className="sticky top-6 space-y-4 border-2 border-v-yellow-warning/50 bg-v-yellow-warning/5 z-10 shadow-xl">
                        <h3 className="font-extrabold text-v-yellow-warning uppercase tracking-widest text-sm mb-2">Publishing Options</h3>

                        <VButton
                            onClick={() => navigate("/teacher/dashboard")}
                            variant="outline"
                            fullWidth
                            className="justify-start"
                        >
                            <Save size={18} className="mr-2" /> Save Draft & Exit
                        </VButton>

                        <VButton
                            onClick={handlePublish}
                            variant="primary"
                            fullWidth
                            className="justify-start"
                        >
                            <Rocket size={18} className="mr-2" /> Publish (Normal)
                        </VButton>

                        <VButton
                            onClick={() => navigate(`/teacher/quiz/${quizId}/enable-exam`)}
                            className="w-full bg-v-purple-accent text-white border-b-4 border-v-purple-contrast hover:translate-y-1 active:border-b-0 hover:border-b-0 transition-transform font-bold py-3 rounded-xl shadow-lg flex items-center uppercase tracking-wide justify-start"
                        >
                            <Shield size={18} className="mr-2" /> Enable Exam Mode
                        </VButton>
                    </VCard>
                </div>
            </div>
        </div>
    );
};

export default ManageQuiz;
