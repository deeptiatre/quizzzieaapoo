import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { enableExamMode } from "../../service/TeacherExamModeServices";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import VInput from "../../component/ui/VInput";
import { Calendar, Clock, Lock, Copy, CheckCircle, ArrowRight, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const EnableExam = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    duration: "",
    tabSwitchLimit: 3
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await enableExamMode(quizId, {
        ...form,
        maxTabSwitch: Number(form.tabSwitchLimit),
        durationMinutes: Number(form.duration)
      });

      setSuccessData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Enable exam failed");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <VCard className="text-center border-2 border-v-green-primary bg-v-bg-card shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-v-green-primary"></div>

            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-v-green-primary/20 rounded-full text-v-green-primary">
                <CheckCircle size={48} />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-white mb-2">Exam Mode Live!</h1>
            <p className="text-v-text-muted font-bold mb-8">
              The exam is now active. Share this code with your students to let them join.
            </p>

            <div className="bg-v-bg-main p-6 rounded-2xl mb-8 border-2 border-v-border-color relative group">
              <p className="text-xs text-v-text-muted uppercase tracking-widest font-bold mb-2">Exam Access Code</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-5xl font-mono font-black tracking-widest text-v-blue-primary drop-shadow-sm">
                  {successData.examCode}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(successData.examCode);
                  alert("Code Copied!");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-v-text-muted hover:text-white transition-colors"
                title="Copy Code"
              >
                <Copy size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <VButton
                onClick={() => navigate("/teacher/dashboard")}
                fullWidth
                variant="primary"
                className="py-3 text-lg"
              >
                Go to Dashboard <ArrowRight size={20} className="ml-2" />
              </VButton>
              <VButton
                onClick={() => navigate(`/teacher/quiz/${quizId}/stats`)}
                fullWidth
                variant="secondary"
                className="py-3"
              >
                View Live Stats
              </VButton>
            </div>
          </VCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-white tracking-wide mb-2">Enable Exam Mode</h1>
        <p className="text-v-text-muted font-bold">Configure strict settings for a secure examination environment.</p>
      </motion.div>

      <VCard className="border-2 border-v-border-color bg-v-bg-card">
        {error && (
          <div className="mb-6 p-4 bg-v-red-error/10 border-2 border-v-red-error rounded-xl text-v-red-error font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-v-text-muted font-bold text-sm uppercase">Start Time</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-v-text-muted pointer-events-none" size={18} />
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-v-bg-main border-2 border-v-border-color rounded-xl pl-11 pr-4 py-3 text-white font-bold focus:outline-none focus:border-v-blue-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-v-text-muted font-bold text-sm uppercase">End Time</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-v-text-muted pointer-events-none" size={18} />
                <input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-v-bg-main border-2 border-v-border-color rounded-xl pl-11 pr-4 py-3 text-white font-bold focus:outline-none focus:border-v-blue-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <VInput
            name="duration"
            label="Duration (minutes)"
            type="number"
            value={form.duration}
            onChange={handleChange}
            icon={<Clock size={18} />}
            required
            placeholder="e.g. 60"
          />

          <VInput
            name="tabSwitchLimit"
            label="Tab Switch Limit (Anti-Cheat)"
            type="number"
            value={form.tabSwitchLimit}
            onChange={handleChange}
            icon={<ShieldAlert size={18} />}
            placeholder="Default: 3"
          />

          <div className="flex gap-4 pt-4 border-t-2 border-v-border-color">
            <VButton
              type="button"
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </VButton>

            <VButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="flex-1"
            >
              {loading ? "Enabling..." : "Confirm & Enable"}
            </VButton>
          </div>
        </form>
      </VCard>
    </div>
  );
};

export default EnableExam;
