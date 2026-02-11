import { useEffect, useState } from "react";
import VCard from "../../../component/ui/VCard";
import { Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const ExamWaiting = ({ exam }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.floor((new Date(exam.startTime) - new Date()) / 1000)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft <= 0) return (
    <VCard className="text-center p-8 bg-v-bg-card border-2 border-v-green-primary">
      <h2 className="text-2xl font-extrabold text-v-green-primary mb-2 animate-bounce">Exam is starting...</h2>
      <p className="text-v-text-muted font-bold">Please wait while we redirect you.</p>
    </VCard>
  );

  return (
    <VCard className="text-center p-10 max-w-lg mx-auto border-2 border-v-border-color">
      <div className="flex justify-center mb-6">
        <div className="bg-v-yellow-warning/20 p-4 rounded-full animate-pulse">
          <Clock size={48} className="text-v-yellow-warning" />
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-white mb-2">Get Ready!</h2>
      <p className="text-v-text-muted font-bold mb-6">The exam will begin shortly.</p>

      <div className="flex justify-center gap-2 items-end mb-8">
        <div className="text-center">
          <div className="bg-v-bg-main border-2 border-v-border-color rounded-xl p-4 min-w-[80px]">
            <span className="text-4xl font-black text-white">{Math.floor(timeLeft / 60)}</span>
          </div>
          <span className="text-xs font-bold text-v-text-muted uppercase mt-2 block">Minutes</span>
        </div>
        <span className="text-2xl font-black text-v-text-muted mb-6">:</span>
        <div className="text-center">
          <div className="bg-v-bg-main border-2 border-v-border-color rounded-xl p-4 min-w-[80px]">
            <span className="text-4xl font-black text-white">{String(timeLeft % 60).padStart(2, "0")}</span>
          </div>
          <span className="text-xs font-bold text-v-text-muted uppercase mt-2 block">Seconds</span>
        </div>
      </div>

      <div className="bg-v-bg-main rounded-xl p-4 flex items-center justify-center gap-3">
        <Calendar size={20} className="text-v-blue-primary" />
        <span className="text-v-text-main font-bold">
          Starts at: {new Date(exam.startTime).toLocaleTimeString()}
        </span>
      </div>
    </VCard>
  );
};

export default ExamWaiting;
