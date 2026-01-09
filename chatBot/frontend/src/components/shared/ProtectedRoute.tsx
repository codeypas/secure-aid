import { Navigate, Outlet } from "react-router-dom";
import { verifyToken } from "../../utils/auth";

interface ProtectedRouteProps {
  allowedRoles?: "user" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const user = verifyToken();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles?.includes(user.sub.role)) {
    return <Outlet />;
  }
  return <Navigate to="/notfound" replace />;
};

export default ProtectedRoute;
