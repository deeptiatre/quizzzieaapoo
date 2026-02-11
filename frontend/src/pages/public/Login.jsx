import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth/AuthContext";
import VCard from "../../component/ui/VCard";
import VButton from "../../component/ui/VButton";
import VInput from "../../component/ui/VInput";
import FloatingBackground from "../../component/ui/FloatingBackground";
import { LogIn, User, Lock } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(formData);
      console.log("Logged in user:", loggedInUser);

      if (loggedInUser.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (loggedInUser.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
          <h1 className="text-4xl font-extrabold text-white tracking-wide mb-2">Welcome Back!</h1>
          <p className="text-v-text-muted font-bold">Login to continue your learning journey.</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <VInput
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: student@example.com"
              icon={<User size={18} />}
              type="email"
              required
            />

            <VInput
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              type="password"
              required
            />

            <div className="pt-2">
              <VButton
                type="submit"
                disabled={loading}
                fullWidth
                variant="primary"
                className="text-lg py-3"
              >
                {loading ? "Logging in..." : "Login"} <LogIn size={20} className="ml-2" />
              </VButton>
            </div>
          </form>

          <div className="mt-8 text-center border-t-2 border-v-border-color pt-6">
            <p className="text-v-text-muted font-bold text-sm">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-v-blue-primary hover:text-white hover:underline transition-colors uppercase tracking-wide font-extrabold ml-1"
              >
                Sign Up
              </button>
            </p>
          </div>
        </VCard>
      </motion.div>
    </div>
  );
};

export default Login;
