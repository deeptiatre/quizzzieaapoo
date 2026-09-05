import { useState } from "react";
import api from "../../../service/api";
import { useNavigate } from "react-router-dom";
import VCard from "../../../component/ui/VCard";
import VButton from "../../../component/ui/VButton";
import VInput from "../../../component/ui/VInput";
import { Key, ArrowRight, Lock } from "lucide-react";
import { motion } from "framer-motion";

const ExamCodeForm = ({ setExamStatus, setExamData }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);

    try {
      const res = await api.post("/exam/join-exam", { examCode: code.trim() });
      const data = res.data.data;

      if (data.Status === "waiting") {
        setExamStatus("waiting");
        setExamData(data);
      } else if (data.Status === "resume" && data.attemptId) {
        setExamStatus("live");
        navigate(`/student/exam/attempt/${data.attemptId}`);
      } else if (data.Status === "start" || data.Status === "resume") {
        setExamStatus("live");
        navigate(`/student/exam/start/${data.quizID}`);
      } else {
        alert("Unexpected exam status: " + data.Status);
      }

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to join exam";
      alert(msg);

      if (msg.includes("ended") || msg.includes("Ended")) {
        setExamStatus("ended");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <VCard className="text-center p-8 border-2 border-v-border-color bg-v-bg-card">
      <div className="flex justify-center mb-6">
        <div className="bg-v-blue-primary/20 p-4 rounded-full">
          <Lock size={40} className="text-v-blue-primary" />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-2">Join an Exam</h2>
      <p className="text-v-text-muted font-bold mb-6">Enter the unique code provided by your teacher.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-v-text-muted" size={20} />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex: AB12-XY34"
            className="w-full bg-v-bg-main border-2 border-v-border-color rounded-2xl py-4 pl-12 pr-4 text-white font-extrabold text-center text-xl tracking-widest placeholder-v-text-muted focus:outline-none focus:border-v-green-primary transition-all uppercase"
            required
          />
        </div>

        <VButton
          type="submit"
          disabled={loading}
          fullWidth
          variant="primary"
          className="py-4 text-lg"
        >
          {loading ? "Verifying..." : "Enter Exam"} <ArrowRight size={20} />
        </VButton>
      </form>
    </VCard>
  );
};

export default ExamCodeForm;
