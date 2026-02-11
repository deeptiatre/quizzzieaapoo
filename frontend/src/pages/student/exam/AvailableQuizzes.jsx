import { useEffect, useState } from "react";
import api from "../../../service/api";
import QuizCard from "../../../component/student/QuizCard";
import { motion } from "framer-motion";

const AvailableQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get("/quizzes/fetch/allquizes");
                const normalQuizzes = res.data.quizes.filter(q => q.quizType === 'normal');
                setQuizzes(normalQuizzes);
            } catch (err) {
                console.error("Failed to fetch quizzes", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-v-green-primary"></div>
        </div>
    );

    if (quizzes.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-extrabold text-white mb-6 border-b-2 border-v-border-color pb-4">
                Practice Quizzes
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                {quizzes.map((quiz, index) => (
                    <motion.div
                        key={quiz._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <QuizCard quiz={quiz} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AvailableQuizzes;
