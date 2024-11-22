import { Navigate } from "react-router";

import { useAuth } from "../hooks/useAuth";

type Role = "super_admin" | "artist_manager" | "artist"

interface AuthorizationGuardProps {
	children: React.ReactNode;
	allowedRoles: Role[];
}

const AuthorizationGuard: React.FC<AuthorizationGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth()

  if (!allowedRoles.includes(user?.role)) {
		return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthorizationGuard;
