import { useEffect, useState } from "react";
import { getAllQuizzes } from "../../service/quizService";
import QuizCard from "../../component/student/QuizCard";
import TopicBar from "../../component/student/TopicBar";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAllQuizzes().then(res => {
            const normalQuizzes = (res.data.quizes || []).filter(q => q.quizType === 'normal');
            setQuizzes(normalQuizzes);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching quizzes:", err);
            setLoading(false);
        });
    }, []);

    // Filter quizzes based on selected difficulty
    const filteredQuizzes = quizzes.filter(q => {
        const matchesDiff = selectedDifficulty === 'All' || q.diffcultylevel === selectedDifficulty.toLowerCase();
        const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
        return matchesDiff && matchesSearch;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-blue-primary"></div>
        </div>
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-7xl mx-auto"
        >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-4 border-b-2 border-v-border-color pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">Explore Quizzes</h1>
                    <p className="text-v-text-muted font-bold">Pick a topic and start learning!</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted group-focus-within:text-v-blue-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search quizzes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-v-bg-card border-2 border-v-border-color rounded-xl py-3 pl-10 pr-4 text-white font-bold placeholder-v-text-muted focus:outline-none focus:border-v-blue-primary transition-all"
                        />
                    </div>

                    <select
                        id="difficulty"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="bg-v-bg-card border-2 border-v-border-color rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-v-green-primary cursor-pointer"
                    >
                        <option value="All">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <TopicBar quizzes={quizzes} />
            </motion.div>

            {filteredQuizzes.length === 0 ? (
                <motion.div variants={itemVariants} className="text-center py-20 bg-v-bg-card rounded-2xl border-2 border-dashed border-v-border-color">
                    <p className="text-v-text-muted font-bold text-lg">No quizzes found matching your filters.</p>
                    <button
                        onClick={() => { setSelectedDifficulty('All'); setSearch('') }}
                        className="mt-4 text-v-blue-primary font-bold hover:underline"
                    >
                        Clear Filters
                    </button>
                </motion.div>
            ) : (
                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuizzes.map(q => (
                        <motion.div key={q._id} variants={itemVariants}>
                            <QuizCard quiz={q} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default QuizList;
