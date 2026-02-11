import { useNavigate } from "react-router-dom";
import VButton from "../../component/ui/VButton";
import VCard from "../../component/ui/VCard";
import FloatingBackground from "../../component/ui/FloatingBackground";
import { BookOpen, Trophy, Users, Clock, Shield, TrendingUp, GraduationCap, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Quizzes",
      description: "Take multiple quizzes with difficulty filters and topics. Track your performance in real-time.",
      color: "text-v-green-primary",
      bgColor: "bg-v-green-primary/10",
      borderColor: "border-v-green-primary/30"
    },
    {
      icon: Clock,
      title: "Exams",
      description: "Enter exam codes, join live exams, and compete with other students. Time-based auto submission ensures fairness.",
      color: "text-v-blue-primary",
      bgColor: "bg-v-blue-primary/10",
      borderColor: "border-v-blue-primary/30"
    },
    {
      icon: Trophy,
      title: "Leaderboard",
      description: "See top scorers for quizzes and exams. Rank is determined by score and submission speed.",
      color: "text-v-yellow-warning",
      bgColor: "bg-v-yellow-warning/10",
      borderColor: "border-v-yellow-warning/30"
    },
    {
      icon: GraduationCap,
      title: "Teacher Tools",
      description: "Teachers can create quizzes, manage exams, and analyze student performance with detailed stats.",
      color: "text-v-purple-accent",
      bgColor: "bg-v-purple-accent/10",
      borderColor: "border-v-purple-accent/30"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Track attempts, scores, and improvement over time. Personalized dashboard for each user role.",
      color: "text-v-blue-primary",
      bgColor: "bg-v-blue-primary/10",
      borderColor: "border-v-blue-primary/30"
    },
    {
      icon: Shield,
      title: "Secure & Fair",
      description: "Auto submission, tab-switch warnings, and secure login keep the platform fair for all participants.",
      color: "text-v-green-primary",
      bgColor: "bg-v-green-primary/10",
      borderColor: "border-v-green-primary/30"
    }
  ];

  return (
    <div className="min-h-screen bg-v-bg-main relative overflow-hidden">
      {/* Floating Background */}
      <FloatingBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-v-green-primary via-v-blue-primary to-v-purple-accent bg-clip-text text-transparent leading-tight">
              Master Knowledge,<br />One Quiz at a Time
            </h1>
            <p className="text-xl md:text-2xl text-v-text-muted mb-10 max-w-3xl mx-auto font-bold">
              Take quizzes, join exams, track your progress, and learn faster with our gamified learning platform.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <VButton
                onClick={() => navigate("/signup")}
                variant="primary"
                className="px-8 py-4 text-lg"
              >
                <Zap size={20} />
                Get Started Free
              </VButton>
              <VButton
                onClick={() => navigate("/login")}
                variant="outline"
                className="px-8 py-4 text-lg"
              >
                Login
              </VButton>
            </div>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, label: "Active Users", value: "10K+" },
              { icon: BookOpen, label: "Quizzes Taken", value: "50K+" },
              { icon: Trophy, label: "Achievements", value: "25K+" }
            ].map((stat, index) => (
              <VCard key={index} className="p-6 border-2 border-v-border-color text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-v-green-primary" />
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-v-text-muted font-bold text-sm uppercase tracking-wider">{stat.label}</p>
              </VCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-white">
            Everything You Need to Succeed
          </h2>
          <p className="text-center text-v-text-muted mb-16 text-lg font-bold">
            Powerful features designed for both students and teachers
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <VCard className={`p-6 border-2 ${feature.borderColor} ${feature.bgColor} h-full hover:scale-105 transition-transform`}>
                  <div className={`w-14 h-14 ${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-black text-xl mb-3 text-white">{feature.title}</h3>
                  <p className="text-v-text-muted font-bold leading-relaxed">
                    {feature.description}
                  </p>
                </VCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <VCard className="p-12 text-center border-2 border-v-green-primary/30 bg-gradient-to-br from-v-green-primary/10 to-v-blue-primary/10">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
              Ready to Start Learning?
            </h2>
            <p className="text-v-text-muted mb-8 text-lg font-bold">
              Join as a student or teacher and explore all the amazing features our platform offers.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <VButton
                onClick={() => navigate("/signup")}
                variant="primary"
                className="px-8 py-4 text-lg"
              >
                Sign Up Now
              </VButton>
              <VButton
                onClick={() => navigate("/login")}
                variant="secondary"
                className="px-8 py-4 text-lg"
              >
                Login
              </VButton>
            </div>
          </VCard>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
