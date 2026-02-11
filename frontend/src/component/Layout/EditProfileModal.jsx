import { useContext, useState } from "react";
import AuthContext from "../../auth/AuthContext";
import api from "../../service/api";
import VCard from "../ui/VCard";
import VButton from "../ui/VButton";
import VInput from "../ui/VInput";
import { User, Mail, X } from "lucide-react";
import { motion } from "framer-motion";

const EditProfileModal = ({ onClose }) => {
  const { user, fetchUser } = useContext(AuthContext);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔵 Updating profile:", { name, email });
      const updateRes = await api.put("/profile/updateprofile", { name, email });
      console.log("✅ Update response:", updateRes.data);

      console.log("🔵 Calling fetchUser...");
      const updatedUser = await fetchUser();
      console.log("✅ fetchUser returned:", updatedUser);

      onClose();
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <VCard className="relative shadow-2xl border-2 border-v-border-color">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-v-text-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-v-blue-primary rounded-full flex items-center justify-center text-white font-black text-3xl mb-3 border-4 border-v-bg-main shadow-lg">
              {name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-2xl font-extrabold text-white">Edit Profile</h2>
            <p className="text-v-text-muted font-bold text-sm">Update your personal details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-bold text-v-text-muted text-sm uppercase">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-v-text-muted pointer-events-none" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-v-bg-main border-2 border-v-border-color rounded-xl pl-11 pr-4 py-3 text-white font-bold focus:outline-none focus:border-v-blue-primary transition-colors"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-v-text-muted text-sm uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-v-text-muted pointer-events-none" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-v-bg-main border-2 border-v-border-color rounded-xl pl-11 pr-4 py-3 text-white font-bold focus:outline-none focus:border-v-blue-primary transition-colors"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <VButton
                type="button"
                onClick={onClose}
                variant="ghost"
                fullWidth
                className="py-3"
              >
                Cancel
              </VButton>

              <VButton
                type="submit"
                disabled={loading}
                variant="primary"
                fullWidth
                className="py-3"
              >
                {loading ? "Saving..." : "Save Changes"}
              </VButton>
            </div>
          </form>
        </VCard>
      </motion.div>
    </div >
  );
};

export default EditProfileModal;
