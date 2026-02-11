import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../auth/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
