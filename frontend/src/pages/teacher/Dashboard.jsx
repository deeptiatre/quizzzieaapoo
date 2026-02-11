import { useEffect, useState } from "react";
// Verified Fix: restored missing buttons and fixed table structure
import api from "../../service/api";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import VInput from "../../component/ui/VInput";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Activity, Trash2, Play, Eye, CheckCircle, AlertCircle } from "lucide-react";

const TeacherDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ examPerformance: [] });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    quizSearch: "",
    difficulty: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const [quizzesRes, statsRes] = await Promise.all([
        api.get("/dashboard/teacher/teacherquizzes", { params }),
        api.get("/dashboard/teacher/teacherDashboard", { params })
      ]);

      setQuizzes(quizzesRes.data.quizes || []);
      console.log("Stats Response:", statsRes.data);
      setDashboardStats(statsRes.data);

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]); // Re-fetch when filters change

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Check if any filter is active
  const isFilterActive = filters.startDate || filters.endDate || filters.quizSearch || filters.difficulty;

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'text-v-green-primary';
      case 'draft': return 'text-v-text-muted';
      case 'ended': return 'text-v-red-error';
      default: return 'text-white';
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-v-text-main tracking-wide">Teacher Dashboard</h1>
        <Link to="/teacher/create-quiz">
          <VButton>+ Create New Quiz</VButton>
        </Link>
      </div>

      {/* Filter Bar */}
      <VCard className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-v-bg-card !p-4">
        <VInput
          type="date"
          name="startDate"
          label="Start Date"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <VInput
          type="date"
          name="endDate"
          label="End Date"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <VInput
          type="text"
          name="quizSearch"
          label="Quiz Title"
          value={filters.quizSearch}
          onChange={handleFilterChange}
          placeholder="Search..."
        />
        <div className="flex flex-col gap-2">
          <label className="font-bold text-v-text-muted uppercase text-sm">Difficulty</label>
          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            className="bg-v-bg-card border-2 border-v-border-color rounded-xl px-4 py-3 text-v-text-main focus:outline-none focus:border-v-blue-primary font-bold h-[52px]"
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </VCard>

      {/* Stats Graph */}
      {!loading && dashboardStats.examPerformance && dashboardStats.examPerformance.length > 0 && (
        <VCard className="h-96">
          <h2 className="text-xl font-bold mb-6 text-v-text-main flex items-center gap-2">
            <CheckCircle className="text-v-blue-primary" /> Average Score per Exam
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={dashboardStats.examPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#37464F" />
              <XAxis
                dataKey="title"
                tick={{ fill: '#AFAFAF', fontSize: 12, fontWeight: 'bold' }}
                axisLine={{ stroke: '#37464F' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#AFAFAF', fontSize: 12, fontWeight: 'bold' }}
                axisLine={{ stroke: '#37464F' }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: '#283944' }}
                contentStyle={{ backgroundColor: '#202F36', borderRadius: '12px', border: '2px solid #37464F', color: '#fff' }}
              />
              <Bar
                dataKey="averageScore"
                fill="#58CC02"
                radius={[8, 8, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </VCard>
      )}

      <h2 className="text-2xl font-bold text-white mb-4">My Quizzes</h2>

      {loading ? (
        <div className="text-center py-20 text-v-text-muted font-bold animate-pulse">Loading your awesome quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20 bg-v-bg-card rounded-2xl border-2 border-dashed border-v-border-color">
          <p className="text-v-text-muted font-bold text-lg">
            {isFilterActive ? "No quizzes found matching filters." : "No quizzes created yet. Let's make one!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <VCard className="flex flex-col h-full justify-between hover:border-v-blue-primary transition-colors duration-200">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 ${quiz.quizStatus === 'live' ? 'bg-v-green-primary/20 border-v-green-primary text-v-green-primary' :
                      quiz.quizStatus === 'draft' ? 'bg-gray-700 border-gray-600 text-gray-400' :
                        'bg-v-red-error/20 border-v-red-error text-v-red-error'
                      }`}>
                      {quiz.quizStatus}
                    </div>
                    <span className="text-v-text-muted text-xs font-bold">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-2 line-clamp-2">{quiz.title}</h3>
                  <p className="text-v-text-muted text-sm font-bold capitalize flex items-center gap-2 mb-6">
                    <BookOpen size={16} /> {quiz.diffcultylevel}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link to={`/teacher/quiz/${quiz._id}/stats`} className="col-span-2">
                    <VButton variant="secondary" fullWidth className="text-sm py-2">
                      <Eye size={18} /> View Stats
                    </VButton>
                  </Link>

                  {quiz.quizStatus === 'draft' && (
                    <VButton
                      variant="primary"
                      className="col-span-2 text-sm py-2"
                      onClick={async () => {
                        if (!window.confirm("Publish this quiz? It will be visible to students.")) return;
                        try {
                          await api.put(`/quizzes/${quiz._id}/publish`);
                          alert("Quiz Published!");
                          window.location.reload();
                        } catch (e) {
                          alert("Failed: " + (e.response?.data?.message || e.message));
                        }
                      }}
                    >
                      <Play size={18} /> Publish
                    </VButton>
                  )}

                  {quiz.quizStatus === 'live' && (
                    <VButton
                      variant="warning"
                      className="col-span-2 text-sm py-2"
                      onClick={async () => {
                        if (!window.confirm("FORCE END EXAM? This will submit all active attempts immediately.")) return;
                        try {
                          await api.put(`/quizzes/${quiz._id}/force-end`);
                          alert("Exam Ended.");
                          window.location.reload();
                        } catch (e) {
                          alert("Failed: " + (e.response?.data?.message || e.message));
                        }
                      }}
                    >
                      <AlertCircle size={18} /> Force End
                    </VButton>
                  )}

                  <VButton
                    variant="danger"
                    className="col-span-2 text-sm py-2"
                    onClick={async () => {
                      if (!window.confirm("DELETE QUIZ? This cannot be undone.")) return;
                      try {
                        await api.delete(`/quizzes/${quiz._id}`);
                        alert("Quiz Deleted");
                        setQuizzes(quizzes.filter(q => q._id !== quiz._id));
                      } catch (e) {
                        alert("Failed: " + (e.response?.data?.message || e.message));
                      }
                    }}
                  >
                    <Trash2 size={18} /> Delete
                  </VButton>
                </div>
              </VCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
