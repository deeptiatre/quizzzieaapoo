import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../../service/TeacherQuizService";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import VInput from "../../component/ui/VInput";
import { Type, BookOpen, FileText, Clock, Signal, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        topic: "",
        discription: "",
        timelimit: "",
        totalmarks: 0,
        diffcultylevel: "easy",
        quizStatus: "draft",
        intent: "draft"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...form,
                timelimit: Number(form.timelimit), // Ensure timelimit is a number
                quizStatus: form.quizStatus
            };
            const res = await createQuiz(payload);

            navigate(`/teacher/quiz/${res.data.quiz._id}/manage`);
        } catch (err) {
            alert(err.response?.data?.message || "Quiz creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-wide mb-2">Create New Quiz</h1>
                    <p className="text-v-text-muted font-bold">Start by setting up the basic details.</p>
                </div>
                <VButton variant="outline" size="sm" onClick={() => navigate('/teacher/dashboard')}>
                    <ArrowLeft size={18} className="mr-2" /> Cancel
                </VButton>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <VCard className="border-2 border-v-border-color bg-v-bg-card shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <VInput
                            name="title"
                            label="Quiz Title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Advanced Mathematics"
                            icon={<Type size={18} />}
                            required
                        />

                        <VInput
                            name="topic"
                            label="Topic"
                            value={form.topic}
                            onChange={handleChange}
                            placeholder="e.g. Algebra"
                            icon={<BookOpen size={18} />}
                            required
                        />

                        <VInput
                            name="discription"
                            label="Description"
                            value={form.discription}
                            onChange={handleChange}
                            placeholder="Briefly describe what this quiz is about..."
                            icon={<FileText size={18} />}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <VInput
                                name="timelimit"
                                label="Time Limit (Minutes)"
                                type="number"
                                value={form.timelimit}
                                onChange={handleChange}
                                placeholder="e.g. 30"
                                icon={<Clock size={18} />}
                                required
                            />

                            <div className="space-y-2">
                                <label className="font-bold text-v-text-muted uppercase text-sm">Difficulty Level</label>
                                <div className="relative">
                                    <Signal className="absolute left-4 top-1/2 -translate-y-1/2 text-v-text-muted pointer-events-none" size={18} />
                                    <select
                                        name="diffcultylevel"
                                        value={form.diffcultylevel}
                                        onChange={handleChange}
                                        className="w-full bg-v-bg-main border-2 border-v-border-color rounded-xl pl-11 pr-4 py-3 text-white font-bold focus:outline-none focus:border-v-blue-primary transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-v-text-muted pointer-events-none">
                                        ▼
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <VButton
                                type="submit"
                                disabled={loading}
                                fullWidth
                                variant="primary"
                                className="text-lg py-3"
                            >
                                {loading ? "Creating..." : "Next: Add Questions"} <ArrowRight size={20} className="ml-2" />
                            </VButton>
                        </div>
                    </form>
                </VCard>
            </motion.div>
        </div>
    );
};

export default CreateQuiz;
