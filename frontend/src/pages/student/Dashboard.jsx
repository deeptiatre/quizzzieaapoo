import { useEffect, useState } from "react";
import api from "../../service/api";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trophy, Target, Activity } from "lucide-react";

import StatCard from "../../component/ui/StatCard";
import ScoreGraph from "../../component/ui/ScoreGraph";
import RecentAttempts from "../../component/ui/RecentAttempts";

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get(
        "/dashboard/student/studentdashboard"
      );
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-v-green-primary"></div>
    </div>
  );

  if (!data) return <p className="text-white">No data available.</p>;

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Student Dashboard
        </h1>
        <span className="text-v-text-muted font-bold">Welcome back!</span>
      </motion.div>

      {/* STATS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Attempts"
          value={data.totalAttempts}
          icon={<Activity size={24} />}
        />
        <StatCard
          title="Avg Score"
          value={data.averageScore}
          icon={<Target size={24} />}
        />
        <StatCard
          title="Best Score"
          value={data.bestScore}
          icon={<Trophy size={24} className="text-v-yellow-warning" />}
        />
        <StatCard
          title="Passed"
          value={data.passCount}
          icon={<CheckCircle size={24} className="text-v-green-primary" />}
        />
        <StatCard
          title="Failed"
          value={data.failCount}
          icon={<XCircle size={24} className="text-v-red-error" />}
        />
      </motion.div>

      {/* GRAPH */}
      <motion.div variants={itemVariants}>
        <ScoreGraph data={data.graphData} />
      </motion.div>

      {/* RECENT ACTIVITY */}
      <motion.div variants={itemVariants}>
        <RecentAttempts attempts={data.recentAttempts} />
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;
