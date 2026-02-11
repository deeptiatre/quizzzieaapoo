import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../auth/AuthContext";
import ProfileMenu from "../Layout/ProfileMenu";
import VButton from "../ui/VButton";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-v-bg-main border-b-2 border-v-border-color sticky top-0 z-50">
      <Link to="/" className="text-2xl font-extrabold text-v-green-primary tracking-wide">
        QuizApp
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-v-text-muted font-bold hover:text-white uppercase tracking-wider text-sm hidden md:block">Home</Link>

        {!user && (
          <div className="flex gap-4">
            <Link to="/login">
              <VButton variant="outline" className="text-sm py-2 px-6">Login</VButton>
            </Link>
            <Link to="/signup">
              <VButton variant="primary" className="text-sm py-2 px-6">Signup</VButton>
            </Link>
          </div>
        )}

        {user && <ProfileMenu />}
      </div>
    </nav>
  );
};

export default Navbar;
