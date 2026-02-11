import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../auth/AuthContext";

const RoleRoute = ({ allowedRole, children }) => {
  const { user, loading } = useContext(AuthContext);
if(loading)return <p>Loading.....</p>;

if(!user) return <Navigate to="/login" replace />;
  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
