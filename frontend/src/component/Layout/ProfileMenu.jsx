import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../auth/AuthContext";
import EditProfileModal from "../Layout/EditProfileModal";
import { User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return null;

  const dashboardRoute =
    user.role === "teacher"
      ? "/teacher/dashboard"
      : "/student/dashboard";

  return (
    <div className="relative">
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-v-purple-accent text-white flex items-center justify-center font-black text-lg cursor-pointer select-none border-2 border-v-border-color hover:scale-105 transition-transform"
      >
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-3 w-72 bg-v-bg-card shadow-2xl rounded-2xl border-2 border-v-border-color z-50 overflow-hidden"
          >
            {/* User Info */}
            <div className="px-6 py-4 border-b-2 border-v-border-color bg-v-bg-main/50">
              <p className="font-bold text-white text-lg truncate">{user.name}</p>
              <p className="text-sm text-v-text-muted font-bold truncate">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full bg-v-blue-primary/20 text-v-blue-primary text-xs font-black uppercase tracking-wider border border-v-blue-primary/30">
                {user.role}
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  navigate(dashboardRoute);
                  setOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-left text-v-text-muted hover:text-white hover:bg-v-bg-main rounded-xl transition-colors font-bold"
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>

              <button
                onClick={() => {
                  setEditOpen(true);
                  setOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-left text-v-text-muted hover:text-white hover:bg-v-bg-main rounded-xl transition-colors font-bold"
              >
                <Settings size={18} /> Edit Profile
              </button>

              <div className="h-px bg-v-border-color my-1 mx-2" />

              <button
                onClick={logout}
                className="w-full px-4 py-3 flex items-center gap-3 text-left text-v-red-error hover:bg-v-red-error/10 rounded-xl transition-colors font-bold"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      {editOpen && (
        <EditProfileModal onClose={() => setEditOpen(false)} />
      )}
    </div>
  );
};

export default ProfileMenu;
