import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeacherQuizLeaderboard } from "../../service/TeacherLeaderboardService";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import { ArrowLeft, Users, Clock, AlertTriangle, FileCheck, Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";

const TeacherQuizLeaderboard = () => {
    const { quizId } = useParams();
    const [data, setData] = useState({ leaderBoard: [], stats: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const result = await getTeacherQuizLeaderboard(quizId);
                console.log("Teacher Leaderboard Response:", result);
                setData(result);
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
                setError("Failed to load leaderboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [quizId]);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-v-red-error">
            <p className="text-xl font-bold">{error}</p>
            <Link to="/teacher/leaderboard" className="text-v-blue-primary hover:underline mt-4 inline-block font-bold">
                &larr; Back to List
            </Link>
        </div>
    );

    const { leaderBoard, stats } = data;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-4 border-b-2 border-v-border-color pb-6"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-wide mb-2">Exam Leaderboard</h1>
                    <p className="text-v-text-muted font-bold">Review student performance and rankings.</p>
                </div>
                <Link to="/teacher/leaderboard">
                    <VButton variant="outline" size="sm">
                        <ArrowLeft size={18} className="mr-2" /> Back to Quizzes
                    </VButton>
                </Link>
            </motion.div>

            {/* Stats Cards */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    <StatCard
                        label="Total Attempts"
                        value={stats.totalAttempts}
                        icon={<Users size={24} />}
                        colorClass="text-v-blue-primary"
                        bgClass="bg-v-blue-primary"
                    />
                    <StatCard
                        label="Manual Submissions"
                        value={stats.manualSubmissions}
                        icon={<FileCheck size={24} />}
                        colorClass="text-v-green-primary"
                        bgClass="bg-v-green-primary"
                    />
                    <StatCard
                        label="Time Up"
                        value={stats.timeUpSubmissions}
                        icon={<Clock size={24} />}
                        colorClass="text-v-yellow-warning"
                        bgClass="bg-v-yellow-warning"
                    />
                    <StatCard
                        label="Flagged (Cheating)"
                        value={stats.cheatinSubmissions}
                        icon={<AlertTriangle size={24} />}
                        colorClass="text-v-red-error"
                        bgClass="bg-v-red-error"
                    />
                </motion.div>
            )}

            {/* Leaderboard Table */}
            <VCard className="p-0 overflow-hidden border-2 border-v-border-color bg-v-bg-card shadow-lg">
                <div className="px-6 py-4 border-b-2 border-v-border-color flex justify-between items-center bg-v-bg-main">
                    <h2 className="text-lg font-bold text-white">Student Rankings</h2>
                    <span className="text-sm font-bold text-v-text-muted px-3 py-1 bg-v-bg-card rounded-lg border-2 border-v-border-color">
                        {leaderBoard.length} Students
                    </span>
                </div>

                {leaderBoard.length === 0 ? (
                    <div className="p-12 text-center text-v-text-muted font-bold text-lg opacity-60">
                        No submissions yet for this exam.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-v-bg-main border-b-2 border-v-border-color">
                                <tr>
                                    <th className="px-6 py-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Rank</th>
                                    <th className="px-6 py-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Submitted</th>
                                    <th className="px-6 py-4 text-v-text-muted uppercase text-xs font-bold tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-v-border-color">
                                {leaderBoard.map((entry, index) => {
                                    let rankIcon = null;
                                    let rankClass = "text-v-text-muted";

                                    if (index === 0) {
                                        rankIcon = <Trophy size={16} />;
                                        rankClass = "text-v-yellow-warning";
                                    } else if (index === 1) {
                                        rankIcon = <Medal size={16} />;
                                        rankClass = "text-gray-300";
                                    } else if (index === 2) {
                                        rankIcon = <Medal size={16} />;
                                        rankClass = "text-amber-600";
                                    }

                                    return (
                                        <motion.tr
                                            key={entry.userID}
                                            className="hover:bg-v-bg-card-hover transition-colors"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center gap-2 font-black ${rankClass}`}>
                                                    <span className="text-xl w-6 text-center">{entry.rank}</span>
                                                    {rankIcon}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-white">{entry.name}</div>
                                                <div className="text-xs font-bold text-v-text-muted">{entry.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-lg font-black text-v-blue-primary">{entry.score}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-v-text-muted">
                                                {new Date(entry.submittedAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {entry.autoSubmitted ? (
                                                    <span className="px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-lg border-2 border-v-yellow-warning bg-v-yellow-warning/10 text-v-yellow-warning">
                                                        <Clock size={12} /> Auto
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-bold rounded-lg border-2 border-v-green-primary bg-v-green-primary/10 text-v-green-primary">
                                                        <FileCheck size={12} /> Manual
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </VCard>
        </div>
    );
};

const StatCard = ({ label, value, icon, colorClass, bgClass }) => (
    <VCard className="p-4 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-default">
        <div className={`p-3 rounded-2xl ${bgClass} bg-opacity-20 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-bold text-v-text-muted uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
        </div>
    </VCard>
);

export default TeacherQuizLeaderboard;
