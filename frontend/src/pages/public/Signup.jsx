import { useState, useContext } from "react";
import AuthContext from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import VInput from "../../component/ui/VInput";
import FloatingBackground from "../../component/ui/FloatingBackground";
import { User, Mail, Lock, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-v-bg-main relative overflow-hidden p-6">
      <FloatingBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-wide mb-2">Create Account</h1>
          <p className="text-v-text-muted font-bold">Join us and start learning today!</p>
        </div>

        <VCard className="border-2 border-v-border-color bg-v-bg-card shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-v-red-error/10 border-2 border-v-red-error text-v-red-error font-bold p-3 rounded-xl mb-6 text-center text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <VInput
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: John Doe"
              icon={<User size={18} />}
              required
            />

            <VInput
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: student@example.com"
              icon={<Mail size={18} />}
              type="email"
              required
            />

            <VInput
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              icon={<Lock size={18} />}
              type="password"
              required
            />

            <div className="space-y-2">
              <label className="font-bold text-v-text-muted uppercase text-sm block">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-4 rounded-xl border-b-4 transition-all flex flex-col items-center gap-2 font-bold ${formData.role === "student"
                      ? "bg-v-blue-primary border-v-blue-shadow text-white translate-y-1 border-b-0"
                      : "bg-v-bg-main border-v-border-color text-v-text-muted hover:bg-v-bg-card-hover"
                    }`}
                >
                  <GraduationCap size={24} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-4 rounded-xl border-b-4 transition-all flex flex-col items-center gap-2 font-bold ${formData.role === "teacher"
                      ? "bg-v-green-primary border-v-green-shadow text-white translate-y-1 border-b-0"
                      : "bg-v-bg-main border-v-border-color text-v-text-muted hover:bg-v-bg-card-hover"
                    }`}
                >
                  <BookOpen size={24} /> Teacher
                </button>
              </div>
            </div>

            <div className="pt-4">
              <VButton
                type="submit"
                disabled={loading}
                fullWidth
                variant="primary"
                className="text-lg py-3"
              >
                {loading ? "Creating..." : "Create Account"} <ArrowRight size={20} className="ml-2" />
              </VButton>
            </div>
          </form>

          <div className="mt-8 text-center border-t-2 border-v-border-color pt-6">
            <p className="text-v-text-muted font-bold text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-v-blue-primary hover:text-white hover:underline transition-colors uppercase tracking-wide font-extrabold ml-1"
              >
                Login
              </button>
            </p>
          </div>
        </VCard>
      </motion.div>
    </div>
  );
};

export default Signup;
