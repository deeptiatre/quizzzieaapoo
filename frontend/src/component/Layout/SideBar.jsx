import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../auth/AuthContext";
import { LayoutDashboard, FileText, CheckSquare, Award, PlusCircle, BookOpen } from "lucide-react";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const commonClasses =
    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold uppercase tracking-wide border-2 border-transparent";

  const activeClass =
    "bg-v-blue-primary/20 text-v-blue-primary border-v-blue-primary shadow-sm transform scale-105";

  const inactiveClass =
    "text-v-text-muted hover:bg-v-bg-card-hover hover:text-white";

  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/student/quizzes", label: "Quizzes", icon: <BookOpen size={20} /> },
    { to: "/student/exam", label: "Exams", icon: <FileText size={20} /> },
    { to: "/student/attempts", label: "My Attempts", icon: <CheckSquare size={20} /> },
    { to: "/student/leaderboard", label: "Leaderboard", icon: <Award size={20} /> }
  ];

  const teacherLinks = [
    { to: "/teacher/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/teacher/create-quiz", label: "Create Quiz", icon: <PlusCircle size={20} /> },
    { to: "/teacher/leaderboard", label: "Leaderboard", icon: <Award size={20} /> }
  ];

  const links =
    user.role === "teacher" ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 min-h-screen bg-v-bg-main border-r-2 border-v-border-color px-4 py-6 flex flex-col gap-6">
      <h2 className="text-xl font-extrabold text-center text-v-green-primary uppercase tracking-widest border-b-2 border-v-border-color pb-4">
        {user.role === "teacher" ? "Teacher Panel" : "Student Panel"}
      </h2>

      <nav className="space-y-3">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${commonClasses} ${isActive ? activeClass : inactiveClass}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
